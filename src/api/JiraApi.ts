import type { APIRequestContext} from '@playwright/test';
import { request } from '@playwright/test';
import { z } from 'zod';

const JiraAuthSchema = z.object({
  session: z.object({
    name: z.string(),
    value: z.string(),
  }),
});

const JiraIssueSchema = z.object({
  id: z.string(),
  key: z.string(),
  fields: z.object({
    summary: z.string(),
    description: z.string().optional(),
    issuetype: z.object({ name: z.string() }),
    status: z.object({ name: z.string() }),
    assignee: z.object({ displayName: z.string() }).nullable().optional(),
    reporter: z.object({ displayName: z.string() }),
    created: z.string(),
    updated: z.string(),
    project: z.object({ key: z.string() }),
    labels: z.array(z.string()).optional(),
    components: z.array(z.object({ name: z.string() })).optional(),
    fixVersions: z.array(z.object({ name: z.string() })).optional(),
    customfield_10000: z.unknown().optional(), // Epic link example
  }),
});

const JiraSearchSchema = z.object({
  issues: z.array(JiraIssueSchema),
  total: z.number(),
  startAt: z.number(),
  maxResults: z.number(),
});

const JiraCreateIssueSchema = z.object({
  id: z.string(),
  key: z.string(),
  self: z.string(),
});

export class JiraApi {
  private client: APIRequestContext;
  private sessionCookie: string | null = null;

  private constructor(client: APIRequestContext) {
    this.client = client;
  }

  static async create(baseURL: string): Promise<JiraApi> {
    const client = await request.newContext({ baseURL });
    return new JiraApi(client);
  }

  async authenticate(email: string, apiToken: string): Promise<void> {
    const response = await this.client.post('/rest/auth/1/session', {
      data: { username: email, password: apiToken },
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    JiraAuthSchema.parse(data);
    this.sessionCookie = `${data.session.name}=${data.session.value}`;
  }

  getSessionCookie(): string | null {
    return this.sessionCookie;
  }

  async getTicket(issueKey: string): Promise<z.infer<typeof JiraIssueSchema>> {
    const response = await this.client.get(`/rest/api/3/issue/${issueKey}`, {
      headers: { Cookie: this.sessionCookie! },
    });
    const data = await response.json();
    return JiraIssueSchema.parse(data);
  }

  async searchIssues(jql: string, maxResults = 50): Promise<z.infer<typeof JiraSearchSchema>> {
    const response = await this.client.get('/rest/api/3/search', {
      params: { jql, maxResults },
      headers: { Cookie: this.sessionCookie! },
    });
    const data = await response.json();
    return JiraSearchSchema.parse(data);
  }

  async createDefect(defect: {
    projectKey: string;
    summary: string;
    description: string;
    issuetype: 'Bug' | 'Task' | 'Story';
    labels?: string[];
    components?: string[];
    assignee?: string;
  }): Promise<z.infer<typeof JiraCreateIssueSchema>> {
    const fields: Record<string, unknown> = {
      project: { key: defect.projectKey },
      summary: defect.summary,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: defect.description }],
          },
        ],
      },
      issuetype: { name: defect.issuetype },
    };

    if (defect.labels?.length) fields.labels = defect.labels;
    if (defect.components?.length) fields.components = defect.components.map((c) => ({ name: c }));
    if (defect.assignee) fields.assignee = { accountId: defect.assignee };

    const response = await this.client.post('/rest/api/3/issue', {
      headers: {
        'Content-Type': 'application/json',
        Cookie: this.sessionCookie!,
      },
      data: { fields },
    });
    const data = await response.json();
    return JiraCreateIssueSchema.parse(data);
  }

  async addComment(issueKey: string, comment: string): Promise<void> {
    await this.client.post(`/rest/api/3/issue/${issueKey}/comment`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: this.sessionCookie!,
      },
      data: {
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: comment }],
            },
          ],
        },
      },
    });
  }

  async linkIssues(issueKey: string, linkedIssueKey: string, linkType = 'Blocks'): Promise<void> {
    await this.client.post('/rest/api/3/issueLink', {
      headers: {
        'Content-Type': 'application/json',
        Cookie: this.sessionCookie!,
      },
      data: {
        type: { name: linkType },
        inwardIssue: { key: linkedIssueKey },
        outwardIssue: { key: issueKey },
      },
    });
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/rest/api/3/myself', {
        headers: { Cookie: this.sessionCookie! },
      });
      return response.ok();
    } catch {
      return false;
    }
  }

  async dispose(): Promise<void> {
    await this.client.dispose();
  }
}