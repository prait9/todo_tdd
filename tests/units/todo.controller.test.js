const httpMocks = require('node-mocks-http');
const todoController = require('../../controllers/todo.controller');
const Todo = require('../../models/todo.model');
const newTodo = require('../mock-data/new-todo.json');

describe('TodoController.createTodo', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

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
});
