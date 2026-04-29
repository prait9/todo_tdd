const Todo = require('../models/todo.model');

const setErrorStatus = (error, fallbackStatus) => {
  if (!error.statusCode) {
    error.statusCode = fallbackStatus;
  }

  return error;
};

const createTodo = async (req, res, next) => {
  try {
    const todo = await Todo.create(req.body);

    return res.status(201).json(todo);
  } catch (error) {
    if (typeof next === 'function') {
      const statusCode = /validation failed/i.test(error.message) ? 400 : 500;

      return next(setErrorStatus(error, statusCode));
    }

    throw error;
  }
};

const getTodos = async (req, res, next) => {
  try {
    const todos = await Todo.find();

    return res.status(200).json(todos);
  } catch (error) {
    if (typeof next === 'function') {
      return next(setErrorStatus(error, 500));
    }

    throw error;
  }
};

module.exports = {
  createTodo,
  CreateTodo: createTodo,
  getTodos,
  GetTodos: getTodos,
};
