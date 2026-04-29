jest.mock('../../models/todo.model', () => ({
  create: jest.fn(),
}));

const request = require('supertest');
const app = require('../../app');
const Todo = require('../../models/todo.model');
const newTodo = require('../mock-data/new-todo.json');
const validationError = new Error('Todo validation failed: done: Path `done` is required.');

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
