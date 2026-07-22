const request = require('supertest');
const app = require('../src/index');

describe('API Health Check', () => {
  test('GET /api/health should return status ok', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('uptime');
  });

  test('GET /api should return API info', async () => {
    const response = await request(app)
      .get('/api')
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('name', 'School ERP API');
    expect(response.body).toHaveProperty('version', '1.0.0');
  });
});

describe('Authentication Endpoints', () => {
  test('POST /api/auth/login/super-admin without credentials should fail', async () => {
    const response = await request(app)
      .post('/api/auth/login/super-admin')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  test('POST /api/auth/login without credentials should fail', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({})
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});

describe('Protected Routes', () => {
  test('GET /api/branches without token should fail', async () => {
    const response = await request(app)
      .get('/api/branches')
      .expect(401);
  });

  test('GET /api/branches/:branchId/students without token should fail', async () => {
    const response = await request(app)
      .get('/api/branches/test-branch-id/students')
      .expect(401);
  });
});

describe('Error Handling', () => {
  test('GET /api/nonexistent should return 404', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect(404);

    expect(response.body).toHaveProperty('error');
  });
});
