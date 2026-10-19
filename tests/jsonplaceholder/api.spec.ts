import { test, expect } from '@playwright/test';
import { JsonPlaceholderApi } from '@api/JsonPlaceholderApi';

test.describe('JSONPlaceholder API Tests', () => {
  let api: JsonPlaceholderApi;

  test.beforeAll(async () => {
    const baseURL = process.env.JSONPLACEHOLDER_BASE_URL ?? 'https://jsonplaceholder.typicode.com';
    api = new JsonPlaceholderApi(baseURL);
  });

  test.afterAll(async () => {
    await api.dispose();
  });

  test('@api Health check', async () => {
    const healthy = await api.healthCheck();
    expect(healthy).toBeTruthy();
  });

  test.describe('Posts', () => {
    test('@api Get all posts', async () => {
      const posts = await api.getPosts();
      expect(Array.isArray(posts)).toBeTruthy();
      expect(posts.length).toBe(100);
      expect(posts[0]).toHaveProperty('userId');
      expect(posts[0]).toHaveProperty('id');
      expect(posts[0]).toHaveProperty('title');
      expect(posts[0]).toHaveProperty('body');
    });

    test('@api Get single post', async () => {
      const post = await api.getPost(1);
      expect(post.id).toBe(1);
      expect(post.userId).toBe(1);
      expect(typeof post.title).toBe('string');
      expect(typeof post.body).toBe('string');
    });

    test('@api Get comments for post', async () => {
      const comments = await api.getComments(1);
      expect(Array.isArray(comments)).toBeTruthy();
      expect(comments.length).toBeGreaterThan(0);
      expect(comments[0]).toHaveProperty('postId', 1);
      expect(comments[0]).toHaveProperty('id');
      expect(comments[0]).toHaveProperty('name');
      expect(comments[0]).toHaveProperty('email');
      expect(comments[0]).toHaveProperty('body');
    });

    test('@api Create post', async () => {
      const newPost = {
        title: 'Test Post',
        body: 'This is a test post',
        userId: 1,
      };

      const created = await api.createPost(newPost);
      expect(created).toHaveProperty('id');
      expect(created.title).toBe(newPost.title);
      expect(created.body).toBe(newPost.body);
      expect(created.userId).toBe(newPost.userId);
    });

    test('@api Update post', async () => {
      const updatedPost = {
        title: 'Updated Title',
        body: 'Updated body content',
        userId: 1,
      };

      const updated = await api.updatePost(1, updatedPost);
      expect(updated.title).toBe(updatedPost.title);
      expect(updated.body).toBe(updatedPost.body);
    });

    test('@api Delete post', async () => {
      await api.deletePost(1);
      // JSONPlaceholder returns 200 for delete but doesn't actually delete
      // This is expected behavior for this test API
    });
  });

  test.describe('Users', () => {
    test('@api Get all users', async () => {
      const users = await api.getUsers();
      expect(Array.isArray(users)).toBeTruthy();
      expect(users.length).toBe(10);
      expect(users[0]).toHaveProperty('id');
      expect(users[0]).toHaveProperty('name');
      expect(users[0]).toHaveProperty('username');
      expect(users[0]).toHaveProperty('email');
      expect(users[0]).toHaveProperty('address');
      expect(users[0]).toHaveProperty('phone');
      expect(users[0]).toHaveProperty('website');
      expect(users[0]).toHaveProperty('company');
    });

    test('@api Get single user', async () => {
      const user = await api.getUser(1);
      expect(user.id).toBe(1);
      expect(typeof user.name).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(user.address).toHaveProperty('city');
      expect(user.company).toHaveProperty('name');
    });
  });

  test.describe('Albums', () => {
    test('@api Get all albums', async () => {
      const albums = await api.getAlbums();
      expect(Array.isArray(albums)).toBeTruthy();
      expect(albums.length).toBe(100);
      expect(albums[0]).toHaveProperty('userId');
      expect(albums[0]).toHaveProperty('id');
      expect(albums[0]).toHaveProperty('title');
    });

    test('@api Get photos for album', async () => {
      const photos = await api.getPhotos(1);
      expect(Array.isArray(photos)).toBeTruthy();
      expect(photos.length).toBeGreaterThan(0);
      expect(photos[0]).toHaveProperty('albumId', 1);
      expect(photos[0]).toHaveProperty('id');
      expect(photos[0]).toHaveProperty('title');
      expect(photos[0]).toHaveProperty('url');
      expect(photos[0]).toHaveProperty('thumbnailUrl');
    });
  });

  test.describe('Todos', () => {
    test('@api Get all todos', async () => {
      const todos = await api.getTodos();
      expect(Array.isArray(todos)).toBeTruthy();
      expect(todos.length).toBe(200);
      expect(todos[0]).toHaveProperty('userId');
      expect(todos[0]).toHaveProperty('id');
      expect(todos[0]).toHaveProperty('title');
      expect(todos[0]).toHaveProperty('completed');
    });
  });
});