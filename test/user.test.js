const test = require('ava')
const request = require('supertest')

const app = require('../app')

test('base route', t =>
  request(app)
    .get('/api/health')
    .then(res => t.is(res.status, 200)))