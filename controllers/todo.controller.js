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

const getTodoById = async (req, res, next) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    return res.status(200).json(todo);
  } catch (error) {
    if (typeof next === 'function') {
      return next(setErrorStatus(error, 500));
    }

    throw error;
  }
};

const updateTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    return res.status(200).json(todo);
  } catch (error) {
    if (typeof next === 'function') {
      return next(setErrorStatus(error, 500));
    }

    throw error;
  }
};

const deleteTodo = async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        error: 'Todo not found',
      });
    }

    return res.status(200).json(todo);
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
  getTodoById,
  GetTodoById: getTodoById,
  updateTodo,
  UpdateTodo: updateTodo,
  deleteTodo,
  DeleteTodo: deleteTodo,
};
