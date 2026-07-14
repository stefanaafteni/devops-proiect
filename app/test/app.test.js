const request = require('supertest');
const app = require('../src/app');

describe('To-Do API Endpoints', () => {
  
  it('Ar trebui sa returneze mesajul de intampinare', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("Welcome to the DevOps To-Do API!");
  });

  it('Ar trebui sa returneze lista de task-uri', async () => {
    const res = await request(app).get('/todos');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('Ar trebui sa poata adauga un task nou', async () => {
    const res = await request(app)
      .post('/todos')
      .send({ task: 'Testare automata pipeline' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.task).toBe('Testare automata pipeline');
  });
});
