import { z } from 'zod';

const JiraIssueSchema = z.object({
  id: z.string(),
  key: z.string(),
  fields: z.object({
    summary: z.string(),
    description: z.unknown().optional(),
    status: z.object({ name: z.string() }),
    labels: z.array(z.string()),
    components: z.array(z.object({ name: z.string() })),
    issuetype: z.object({ name: z.string() }),
    project: z.object({ key: z.string() }),
  }),
});

const _JiraSearchResultSchema = z.object({
  issues: z.array(JiraIssueSchema),
  total: z.number(),
});

export type JiraIssue = z.infer<typeof JiraIssueSchema>;
export type JiraSearchResult = z.infer<typeof _JiraSearchResultSchema>;

export class JiraApi {
  private readonly baseUrl: string;
  private readonly email: string;
  private readonly apiToken: string;

  constructor() {
    this.baseUrl = process.env.JIRA_BASE_URL ?? '';
    this.email = process.env.JIRA_EMAIL ?? '';
    this.apiToken = process.env.JIRA_API_TOKEN ?? '';

    if (!this.baseUrl || !this.email || !this.apiToken) {
      throw new Error('JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN must be set');
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/rest/api/3${endpoint}`;
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString('base64');

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Jira API ${response.status}: ${error}`);
    }

    return response.json() as Promise<T>;
  }

  async getTicket(key: string): Promise<JiraIssue> {
    return this.request<JiraIssue>(`/issue/${key}`);
  }

  async searchIssues(jql: string, maxResults = 50): Promise<JiraSearchResult> {
    return this.request<JiraSearchResult>(
      `/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}`
    );
  }

  async createDefect(data: {
    projectKey: string;
    summary: string;
    description: string;
    labels?: string[];
    components?: string[];
    parentKey?: string;
  }): Promise<JiraIssue> {
    const fields: Record<string, unknown> = {
      project: { key: data.projectKey },
      summary: data.summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: data.description }],
          },
        ],
      },
      issuetype: { name: 'Bug' },
      labels: ['auto-generated', 'qa-pipeline', ...(data.labels ?? [])],
    };

    if (data.components?.length) {
      fields.components = data.components.map(name => ({ name }));
    }

    if (data.parentKey) {
      fields.parent = { key: data.parentKey };
    }

    return this.request<JiraIssue>('/issue', {
      method: 'POST',
      body: JSON.stringify({ fields }),
    });
  }

  async addComment(issueKey: string, comment: string): Promise<void> {
    await this.request(`/issue/${issueKey}/comment`, {
      method: 'POST',
      body: JSON.stringify({
        body: {
          type: 'doc',
          version: 1,
          content: [{ type: 'paragraph', content: [{ type: 'text', text: comment }] }],
        },
      }),
    });
  }

  async transitionIssue(issueKey: string, transitionName: string): Promise<void> {
    const _issue = await this.getTicket(issueKey);
    const transitions = await this.request<{ transitions: Array<{ id: string; name: string }> }>(
      `/issue/${issueKey}/transitions`
    );

    const transition = transitions.transitions.find(
      t => t.name.toLowerCase() === transitionName.toLowerCase()
    );
    if (!transition) {
      throw new Error(`Transition "${transitionName}" not found for ${issueKey}`);
    }

    await this.request(`/issue/${issueKey}/transitions`, {
      method: 'POST',
      body: JSON.stringify({ transition: { id: transition.id } }),
    });
  }

  async findExistingDefect(
    sourceTicketKey: string,
    errorSignature: string
  ): Promise<JiraIssue | null> {
    const jql = `project = ${sourceTicketKey.split('-')[0]} AND labels = auto-generated AND labels = qa-pipeline AND summary ~ "${errorSignature}" ORDER BY created DESC`;
    const result = await this.searchIssues(jql, 5);
    return result.issues[0] ?? null;
  }
}
