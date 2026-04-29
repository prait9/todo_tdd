const express = require('express');
const todoRoutes = require('./routes/todo.routes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('test!');
});

app.use('/todos', todoRoutes);

app.use((error, req, res, next) => {
  const statusCode = error.statusCode || 400;

  res.status(statusCode).json({
    error: error.message,
  });
});

module.exports = app;
