const express = require('express');
const todoRoutes = require('./routes/todo.routes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('test!');
});

app.use('/todos', todoRoutes);

module.exports = app;
