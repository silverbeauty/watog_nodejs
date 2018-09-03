const app = require('../app')
const test = require('ava')

test('base route', t =>
  request(app)
    .get('/api/health')
    .then(res => t.is(res.status, 200)))