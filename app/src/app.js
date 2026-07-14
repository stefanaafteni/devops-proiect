const express = require('express');
const client = require('prom-client');

const app = express();
const port = process.env.PORT || 3000;

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestCounter = new client.Counter({
  name: 'todo_requests_total',
  help: 'Numarul total de cereri HTTP primite',
  labelNames: ['method', 'route', 'status_code']
});

app.use(express.json());

let todos = [
  { id: 1, task: "Invata Kubernetes", completed: false },
  { id: 2, task: "Configureaza Jenkins", completed: false }
];

app.get('/', (req, res) => {
  httpRequestCounter.inc({ method: 'GET', route: '/', status_code: 200 });
  res.status(200).json({ message: "Welcome to the DevOps To-Do API!" });
});

app.get('/todos', (req, res) => {
  httpRequestCounter.inc({ method: 'GET', route: '/todos', status_code: 200 });
  res.status(200).json(todos);
});

app.post('/todos', (req, res) => {
  const { task } = req.body;
  if (!task) {
    httpRequestCounter.inc({ method: 'POST', route: '/todos', status_code: 400 });
    return res.status(400).json({ error: "Task-ul nu poate fi gol!" });
  }
  const newTodo = { id: todos.length + 1, task, completed: false };
  todos.push(newTodo);
  httpRequestCounter.inc({ method: 'POST', route: '/todos', status_code: 201 });
  res.status(201).json(newTodo);
});

app.get('/metrics', async (req, res) => {
  res.setHeader('Content-Type', client.register.contentType);
  res.send(await client.register.metrics());
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Serverul ruleaza pe portul ${port}`);
  });
}

module.exports = app;
