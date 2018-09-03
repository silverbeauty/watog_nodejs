const test = require('ava')
const request = require('supertest')
const fs = require('fs')
const path = require('path')

const app = require('../app')

test.before(async () => {
	try {
		fs.unlinkSync(path.resolve('../config/test.sqlite'))
	} catch (e) {
		console.error(e)
	}
})

// Health Check API
test('Health Check', t =>
  request(app)
    .get('/api/health')
    .then(res => t.is(res.status, 200)))

// Sign Up
test('user: POST /user should return 200', async t => {
  const res = await request(app)
    .post(`/api/user`)
    .set({ 'Content-Type': 'application/json' })
    .send({
			'email': 'test3@test.com',
			'first_name': 'Test1',
			'last_name': 'Test',
			'cell_phone': '1234567894',
			'country': 'usa',
			'password': '123456',
			'hospital': 'b',
			'user_name': 'test4',
			'job': 'Doctor'
    })
  t.is(res.status, 200)
})
