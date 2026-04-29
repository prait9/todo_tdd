jest.mock('../../models/todo.model', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
}));

const request = require('supertest');
const app = require('../../app');
const Todo = require('../../models/todo.model');
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos');
const validationError = new Error('Todo validation failed: done: Path `done` is required.');
const missingTodoId = '661a7c1b8f9a4b2c3d4e5fff';
const firstTodo = allTodos[0];
const updateTestData = {
  title: 'Integration updated todo',
  done: true,
};
const updatedTodo = {
  ...firstTodo,
  ...updateTestData,
};

describe('POST /todos', () => {
  beforeEach(() => {
    Todo.create.mockReset();
    Todo.create.mockResolvedValue(newTodo);
  });

  it('should create a todo through the application layers', async () => {
    const response = await request(app).post('/todos').send(newTodo);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe(newTodo.title);
    expect(response.body.done).toBe(newTodo.done);
    expect(Todo.create).toHaveBeenCalledWith(newTodo);
  });

  it('should return 400 with json error when done is missing', async () => {
    Todo.create.mockRejectedValueOnce(validationError);

    const response = await request(app).post('/todos').send({
      title: newTodo.title,
    });

    expect(response.statusCode).toBe(400);
    expect(response.body).toEqual({
      error: validationError.message,
    });
  });
});

describe('GET /todos', () => {
  beforeEach(() => {
    Todo.find.mockReset();
    Todo.find.mockResolvedValue(allTodos);
  });

  it('should return all todos as an array', async () => {
    const response = await request(app).get('/todos');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(allTodos);
    expect(response.body).toHaveLength(allTodos.length);
    expect(Todo.find).toHaveBeenCalled();
  });
});

describe('GET /todos/:id', () => {
  beforeEach(() => {
    Todo.findById.mockReset();
    Todo.findById.mockResolvedValue(firstTodo);
  });

  it('should return one todo by id', async () => {
    const response = await request(app).get(`/todos/${firstTodo._id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(firstTodo);
    expect(Todo.findById).toHaveBeenCalledWith(firstTodo._id);
  });

  it('should return 404 when todo does not exist', async () => {
    Todo.findById.mockResolvedValueOnce(null);

    const response = await request(app).get(`/todos/${missingTodoId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: 'Todo not found',
    });
  });
});

describe('PUT /todos/:id', () => {
  beforeEach(() => {
    Todo.findByIdAndUpdate.mockReset();
    Todo.findByIdAndUpdate.mockResolvedValue(updatedTodo);
  });

  it('should update one todo by id', async () => {
    const response = await request(app).put(`/todos/${firstTodo._id}`).send(updateTestData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(updatedTodo);
    expect(Todo.findByIdAndUpdate).toHaveBeenCalledWith(firstTodo._id, updateTestData, {
      new: true,
      runValidators: true,
    });
  });

  it('should return 404 when updated todo does not exist', async () => {
    Todo.findByIdAndUpdate.mockResolvedValueOnce(null);

    const response = await request(app).put(`/todos/${missingTodoId}`).send(updateTestData);

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      error: 'Todo not found',
    });
  });
});
