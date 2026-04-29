jest.mock('../../models/todo.model', () => ({
  create: jest.fn(),
}));

const request = require('supertest');
const app = require('../../app');
const Todo = require('../../models/todo.model');
const newTodo = require('../mock-data/new-todo.json');

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
});
