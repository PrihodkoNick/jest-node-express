const request = require('supertest');
const app = require('../../app');
const newTodo = require('../mock-data/new-todo.json');

const endpointUrl = '/todos/';

describe(endpointUrl, async () => {
  it('POST ' + endpointUrl, () => {
    request(app)
      .post(endpointUrl)
      .send(newTodo);
  })
})

