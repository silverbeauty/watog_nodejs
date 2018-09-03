const test = require('ava')
const request = require('supertest')

const app = require('../app')

test('Health Check', t =>
  request(app)
    .get('/api/health')
    .then(res => t.is(res.status, 200)))
