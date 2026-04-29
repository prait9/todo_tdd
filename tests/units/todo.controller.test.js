const httpMocks = require('node-mocks-http');
const todoController = require('../../controllers/todo.controller');
const Todo = require('../../models/todo.model');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos');

describe('TodoController.createTodo', () => {
  let req;
  let res;
  let next;
  let validationError;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    validationError = new Error('Todo validation failed: done: Path `done` is required.');

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();
    req.body = newTodo;

    Todo.create = jest.fn().mockResolvedValue(newTodo);
  });

  it('should call Todo.create with request body', async () => {
    await todoController.createTodo(req, res, next);

    expect(Todo.create).toHaveBeenCalledWith(newTodo);
  });

  it('should respond with status code 201', async () => {
    await todoController.createTodo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('should respond with created todo as json', async () => {
    await todoController.createTodo(req, res, next);

    expect(res.json).toHaveBeenCalledWith(newTodo);
  });

  it('should call next with error when done is missing', async () => {
    req.body = {
      title: newTodo.title,
    };
    Todo.create.mockRejectedValue(validationError);

    await todoController.createTodo(req, res, next);

    expect(next).toHaveBeenCalledWith(validationError);
  });
});

describe('TodoController.getTodos', () => {
  let req;
  let res;
  let next;
  let fetchError;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();
    fetchError = new Error('Failed to fetch todos');

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    Todo.find = jest.fn().mockResolvedValue(allTodos);
  });

  it('should call Todo.find', async () => {
    await todoController.getTodos(req, res, next);

    expect(Todo.find).toHaveBeenCalled();
  });

  it('should respond with status code 200', async () => {
    await todoController.getTodos(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should respond with all todos as json', async () => {
    await todoController.getTodos(req, res, next);

    expect(res.json).toHaveBeenCalledWith(allTodos);
  });

  it('should call next with error when todos cannot be fetched', async () => {
    Todo.find.mockRejectedValue(fetchError);

    await todoController.getTodos(req, res, next);

    expect(next).toHaveBeenCalledWith(fetchError);
    expect(fetchError.statusCode).toBe(500);
  });
});
