import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app, httpServer } from '../index';
import { prisma } from '../prisma';

describe('API Routes Integration & Flow Tests', () => {
  const testUser = {
    name: 'Gianni Infantino',
    email: `gianni.${Date.now()}@fifa.org`, // Unique email per run
    password: 'fifapresident2026',
    role: 'STAFF',
  };

  let accessToken = '';

  // Close HTTP server socket and Prisma client connection after tests finish
  afterAll(async () => {
    httpServer.close();
    // Clean up created test users
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: '@fifa.org'
        }
      }
    });
    await prisma.$disconnect();
  });

  // Integration Test 1: Public Health Check
  it('GET /health - should return API status healthy', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('healthy');
  });

  // Integration Test 2: User registration
  it('POST /api/auth/register - should create a new user profile', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.email).toBe(testUser.email);
    expect(res.body.data.user.role).toBe(testUser.role);
    expect(res.body.data.user.password).toBeUndefined(); // Security: password omitted
  });

  // Integration Test 3: User login (E2E Part 1)
  it('POST /api/auth/login - should authenticate user and issue token + cookie', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.accessToken).toBeDefined();
    
    accessToken = res.body.data.accessToken;

    // Check refresh cookie is present
    const cookies = res.headers['set-cookie'] as any;
    expect(cookies).toBeDefined();
    expect(cookies[0]).toContain('refreshToken');
    expect(cookies[0]).toContain('HttpOnly');
  });

  // Integration Test 4: Retrieve profile with JWT auth
  it('GET /api/auth/profile - should fetch profile data of logged in user', async () => {
    const res = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  // Integration Test 5: AI Chat interaction (E2E Part 2)
  it('POST /api/ai/chat - should send wayfinding question and receive AI translated routing info', async () => {
    const res = await request(app)
      .post('/api/ai/chat')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        query: 'where is the nearest accessible restroom?',
        language: 'es', // Request Spanish translation
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('success');
    expect(res.body.data.response).toBeDefined();
    // Validate Spanish wayfinding text returned
    expect(res.body.data.response).toContain('baño');
    expect(res.body.data.response).toContain('Sección 104');
  });
});
