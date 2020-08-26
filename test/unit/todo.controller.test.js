const TodoController = require('../../controllers/todo.controller');
const TodoModel = require('../../model/todo.model');
const httpMocks = require("node-mocks-http");
const newTodo = require('../mock-data/new-todo.json');
const allTodos = require('../mock-data/all-todos.json');

TodoModel.create = jest.fn();
TodoModel.find = jest.fn();
TodoModel.findById = jest.fn();

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest();
  res = httpMocks.createResponse();
  next = jest.fn();
})

// get - get one todo
describe('TodoController.getTodo', () => {
  it('should have a getTodoById', () => {
    expect(typeof TodoController.getTodoById).toBe('function');
  });

  it('should call TodoModel.findById with router params', async () => {
    req.params.todoId = '5f46160de6b2297c3f531862';
    await TodoController.getTodoById(req, res, next);
    expect(TodoModel.findById).toBeCalledWith('5f46160de6b2297c3f531862');
  });

  it('should return json body and response code 200', async () => {
    TodoModel.findById.mockReturnValue(newTodo);
    await TodoController.getTodoById(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
    expect(res._isEndCalled()).toBeTruthy();
  });
});

// get - get all todos
describe('TodoController.getTodos', () => {
  it('should have a getTodos function', () => {
    expect(typeof TodoController.getTodos).toBe('function');
  });

  it('should call TodoModel.find({})', async () => {
    await TodoController.getTodos(req, res, next);
    expect(TodoModel.find).toHaveBeenCalledWith({});
  });

  it('should return response with status 200 and all todos', async () => {
    TodoModel.find.mockReturnValue(allTodos);
    await TodoController.getTodos(req, res, next);
    expect(res.statusCode).toBe(200);
    expect(res._isEndCalled()).toBeTruthy();
    expect(res._getJSONData()).toStrictEqual(allTodos);
  });

  it('should handle errors in getTodos', async () => {
    const errorMessage = {message: 'Error finding'};
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.find.mockReturnValue(rejectedPromise);
    await TodoController.getTodos(req, res, next);
    expect(next).toHaveBeenCalledWith(errorMessage);
  });
});

// post - create new todo
describe('TodoController.createTodo', () => {
  beforeEach(() => {
    req.body = newTodo;
  })

  it('should have a createTodo function', () => {
    expect(typeof TodoController.createTodo).toBe('function');
  });

  it('should call TodoModel.create', () => {
    TodoController.createTodo(req, res, next);
    expect(TodoModel.create).toBeCalledWith(newTodo);
  });

  it('should return 201 response code', async () => {
    await TodoController.createTodo(req, res, next);
    expect(res.statusCode).toBe(201);
    expect(res._isEndCalled()).toBeTruthy();
  });

  it('should return json body in response', async () => {
    TodoModel.create.mockReturnValue(newTodo);
    await TodoController.createTodo(req, res, next);
    expect(res._getJSONData()).toStrictEqual(newTodo);
  });

  it('should handle errors', async () => {
    const errorMessage = {message: 'Done property missing'};
    const rejectedPromise = Promise.reject(errorMessage);
    TodoModel.create.mockReturnValue(rejectedPromise);
    await TodoController.createTodo(req, res, next);
    expect(next).toBeCalledWith(errorMessage);
  });
})