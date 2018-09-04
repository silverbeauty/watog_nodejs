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
	// Create 10 users

	for (let i = 0 ; i < 10; i ++) {
		const res = await request(app)
    .post(`/api/user`)
    .set({ 'Content-Type': 'application/json' })
    .send({
			'email': `test${i}@test.com`,
			'first_name': `Test${i}`,
			'last_name': `Last${i}`,
			'cell_phone': `123456789${i}`,
			'country': 'usa',
			'password': `123456${i}`,
			'hospital': `Hospital${i}`,
			'user_name': `test${i}`,
			'job': 'Doctor'
    })
	  t.is(res.status, 200)
	}
})
