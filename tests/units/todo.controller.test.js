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

describe('TodoController.getTodoById', () => {
  let req;
  let res;
  let next;
  let fetchError;

  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id: newTodo._id,
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
    fetchError = new Error('Failed to fetch todo');

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    Todo.findById = jest.fn().mockResolvedValue(newTodo);
  });

  it('should have getTodoById function', () => {
    expect(typeof todoController.getTodoById).toBe('function');
  });

  it('should call Todo.findById with request param id', async () => {
    await todoController.getTodoById(req, res, next);

    expect(Todo.findById).toHaveBeenCalledWith(newTodo._id);
  });

  it('should respond with status code 200', async () => {
    await todoController.getTodoById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should respond with todo as json', async () => {
    await todoController.getTodoById(req, res, next);

    expect(res.json).toHaveBeenCalledWith(newTodo);
  });

  it('should call next with error when todo cannot be fetched', async () => {
    Todo.findById.mockRejectedValue(fetchError);

    await todoController.getTodoById(req, res, next);

    expect(next).toHaveBeenCalledWith(fetchError);
    expect(fetchError.statusCode).toBe(500);
  });

  it('should respond with status code 404 when todo does not exist', async () => {
    Todo.findById.mockResolvedValue(null);

    await todoController.getTodoById(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Todo not found',
    });
  });
});

describe('TodoController.updateTodo', () => {
  let req;
  let res;
  let next;
  let updateError;
  let testData;
  let updatedTodo;

  beforeEach(() => {
    testData = {
      title: 'Write Todo controller tests better',
      done: true,
    };
    updatedTodo = {
      ...newTodo,
      ...testData,
    };
    req = httpMocks.createRequest({
      params: {
        id: newTodo._id,
      },
      body: testData,
    });
    res = httpMocks.createResponse();
    next = jest.fn();
    updateError = new Error('Failed to update todo');

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    Todo.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTodo);
  });

  it('should have updateTodo function', () => {
    expect(typeof todoController.updateTodo).toBe('function');
  });

  it('should call Todo.findByIdAndUpdate with id and request body', async () => {
    await todoController.updateTodo(req, res, next);

    expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(newTodo._id, testData, {
      new: true,
      runValidators: true,
    });
  });

  it('should respond with status code 200', async () => {
    await todoController.updateTodo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should respond with updated todo as json', async () => {
    await todoController.updateTodo(req, res, next);

    expect(res.json).toHaveBeenCalledWith(updatedTodo);
  });

  it('should call next with error when todo cannot be updated', async () => {
    Todo.findByIdAndUpdate.mockRejectedValue(updateError);

    await todoController.updateTodo(req, res, next);

    expect(next).toHaveBeenCalledWith(updateError);
    expect(updateError.statusCode).toBe(500);
  });

  it('should respond with status code 404 when todo does not exist', async () => {
    Todo.findByIdAndUpdate.mockResolvedValue(null);

    await todoController.updateTodo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Todo not found',
    });
  });
});

describe('TodoController.deleteTodo', () => {
  let req;
  let res;
  let next;
  let deleteError;

  beforeEach(() => {
    req = httpMocks.createRequest({
      params: {
        id: newTodo._id,
      },
    });
    res = httpMocks.createResponse();
    next = jest.fn();
    deleteError = new Error('Failed to delete todo');

    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn();

    Todo.findByIdAndDelete = jest.fn().mockResolvedValue(newTodo);
  });

  it('should have deleteTodo function', () => {
    expect(typeof todoController.deleteTodo).toBe('function');
  });

  it('should call Todo.findByIdAndDelete with request param id', async () => {
    await todoController.deleteTodo(req, res, next);

    expect(Todo.findByIdAndDelete).toHaveBeenCalledWith(newTodo._id);
  });

  it('should respond with status code 200', async () => {
    await todoController.deleteTodo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should respond with deleted todo as json', async () => {
    await todoController.deleteTodo(req, res, next);

    expect(res.json).toHaveBeenCalledWith(newTodo);
  });

  it('should call next with error when todo cannot be deleted', async () => {
    Todo.findByIdAndDelete.mockRejectedValue(deleteError);

    await todoController.deleteTodo(req, res, next);

    expect(next).toHaveBeenCalledWith(deleteError);
    expect(deleteError.statusCode).toBe(500);
  });

  it('should respond with status code 404 when todo does not exist', async () => {
    Todo.findByIdAndDelete.mockResolvedValue(null);

    await todoController.deleteTodo(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Todo not found',
    });
  });
});
