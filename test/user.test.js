const test = require('ava')
const request = require('supertest')
const fs = require('fs')
const path = require('path')

const app = require('../app')

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

// Create Default Categories
test('Categories Test', async t => {

	const resLogin = await request(app)
    .post(`/api/user/login`)
    .set({ 'Content-Type': 'application/json' })
    .send({
			'email': `test0@test.com`,
			'password': `1234560`
    })

  t.is(resLogin.status, 200)
  const token = resLogin.body.data.token

  const categories = [
  	{
			'type': `mid_wife`,
			'description': `Mid Wife`,
			'score_ratio': 0.4
    }, {
    	type: 'medical_doctor',
    	description: 'Medical Doctor',
    	score_ratio: 0.5
    }, {
    	type: 'medical_student',
    	description: 'Medical Student',
    	score_ratio: 0.7
    }, {
    	type: 'confirmed_ob_gyn',
    	description: 'Confirmed OB/GYN',
    	score_ratio: 0.8
    }, {
    	type: 'fellow_young_ob_gyn',
    	description: 'Fellow or young OB/GYN',
    	score_ratio: 0.9
    }, {
    	type: 'trainee_resident_on_gyn',
    	description: 'Trainee or resident in ON/GYN'
    }]

  for (let i in categories) {
	  const res = await request(app)
	    .post(`/api/category`)
	    .set({ 'Content-Type': 'application/json', 'Authorization': token })
	    .send(categories[i])
	 	
	 	t.is(res.status, 200)
  }
}) 
