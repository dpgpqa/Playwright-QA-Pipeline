import type { APIRequestContext} from '@playwright/test';
import { request } from '@playwright/test';
import { z } from 'zod';

const PostSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

const CommentSchema = z.object({
  postId: z.number(),
  id: z.number(),
  name: z.string(),
  email: z.string(),
  body: z.string(),
});

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  email: z.string(),
  address: z.object({
    street: z.string(),
    suite: z.string(),
    city: z.string(),
    zipcode: z.string(),
    geo: z.object({ lat: z.string(), lng: z.string() }),
  }),
  phone: z.string(),
  website: z.string(),
  company: z.object({
    name: z.string(),
    catchPhrase: z.string(),
    bs: z.string(),
  }),
});

const AlbumSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
});

const PhotoSchema = z.object({
  albumId: z.number(),
  id: z.number(),
  title: z.string(),
  url: z.string(),
  thumbnailUrl: z.string(),
});

const TodoSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  completed: z.boolean(),
});

export class JsonPlaceholderApi {
  private client: APIRequestContext;

  private constructor(client: APIRequestContext) {
    this.client = client;
  }

  static async create(baseURL: string = 'https://jsonplaceholder.typicode.com'): Promise<JsonPlaceholderApi> {
    const client = await request.newContext({ baseURL });
    return new JsonPlaceholderApi(client);
  }

  async getPosts(): Promise<z.infer<typeof PostSchema>[]> {
    const response = await this.client.get('/posts');
    const data = await response.json();
    return z.array(PostSchema).parse(data);
  }

  async getPost(id: number): Promise<z.infer<typeof PostSchema>> {
    const response = await this.client.get(`/posts/${id}`);
    const data = await response.json();
    return PostSchema.parse(data);
  }

  async getComments(postId?: number): Promise<z.infer<typeof CommentSchema>[]> {
    const url = postId ? `/posts/${postId}/comments` : '/comments';
    const response = await this.client.get(url);
    const data = await response.json();
    return z.array(CommentSchema).parse(data);
  }

  async getUsers(): Promise<z.infer<typeof UserSchema>[]> {
    const response = await this.client.get('/users');
    const data = await response.json();
    return z.array(UserSchema).parse(data);
  }

  async getUser(id: number): Promise<z.infer<typeof UserSchema>> {
    const response = await this.client.get(`/users/${id}`);
    const data = await response.json();
    return UserSchema.parse(data);
  }

  async getAlbums(): Promise<z.infer<typeof AlbumSchema>[]> {
    const response = await this.client.get('/albums');
    const data = await response.json();
    return z.array(AlbumSchema).parse(data);
  }

  async getPhotos(albumId?: number): Promise<z.infer<typeof PhotoSchema>[]> {
    const url = albumId ? `/albums/${albumId}/photos` : '/photos';
    const response = await this.client.get(url);
    const data = await response.json();
    return z.array(PhotoSchema).parse(data);
  }

  async getTodos(): Promise<z.infer<typeof TodoSchema>[]> {
    const response = await this.client.get('/todos');
    const data = await response.json();
    return z.array(TodoSchema).parse(data);
  }

  async createPost(post: { title: string; body: string; userId: number }) {
    const response = await this.client.post('/posts', {
      data: post,
    });
    const data = await response.json();
    return PostSchema.parse(data);
  }

  async updatePost(id: number, post: { title: string; body: string; userId: number }) {
    const response = await this.client.put(`/posts/${id}`, {
      data: post,
    });
    const data = await response.json();
    return PostSchema.parse(data);
  }

  async deletePost(id: number): Promise<void> {
    await this.client.delete(`/posts/${id}`);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.client.get('/posts/1');
      return response.ok();
    } catch {
      return false;
    }
  }

  async dispose(): Promise<void> {
    await this.client.dispose();
  }
}
