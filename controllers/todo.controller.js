const Todo = require('../models/todo.model');

const createTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body);

    return res.status(201).json(todo);
  } catch (error) {
    if (typeof next === 'function') {
      return next(error);
    }

    throw error;
  }
};

module.exports = {
  createTodo,
  CreateTodo: createTodo,
};
