const test = require('ava')
const request = require('supertest')
const fs = require('fs')
const path = require('path')

const app = require('../app')
const Verify = require('../models/verify')
const Lib = require('./lib')

const strImage = `data:image/png;base64,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`

// Health Check API
test('Health Check', t =>
  request(app)
    .get('/api/health')
    .then(res => t.is(res.status, 200)))

// Sign Up
test('Create Sample Data', async t => {

	let tokens = []
	let categories = []
	let posts = []
	let users = []
	const countries = ['USA', 'France', 'Germany', 'Netherlands', 'UK']
	// Create 20 users - Sign Up
	for (let i = 0 ; i < 20; i ++) {
		const res = await request(app)
	    .post(`/api/user`)
	    .set({ 'Content-Type': 'application/json' })
	    .send({
				'email': `test${i}@test.com`,
				'first_name': `Test${i}`,
				'last_name': `Last${i}`,
				'cell_phone': `123456789${i}`,
				'country': countries[i % countries.length],
				'password': `123456${i}`,
				'hospital': `Hospital${i}`,
				'user_name': `test${i}`,
				'job': 'Doctor',
				'bio': `I am Test${i}`
	    })
	  t.is(res.status, 200)

		// Login as test0
		const resLogin = await request(app)
	    .post(`/api/user/login`)
	    .set({ 'Content-Type': 'application/json' })
	    .send({
				'email': `test${i}@test.com`,
				'password': `123456${i}`
	    })

	  t.is(resLogin.status, 200)
	  tokens[i] = resLogin.body.data.token

		// Upload proof of status
		const verifyRes = await request(app)
	    .post(`/api/file/verify`)
	    .set({ 'Content-Type': 'application/json', Authorization: tokens[i] })
	    .send({
				'file': strImage
	    })
	  t.is(verifyRes.status, 200)

	  // Get me 

		const meRes = await request(app)
	    .get(`/api/user/me`)
	    .set({ 'Content-Type': 'application/json', Authorization: tokens[i] })

	  t.is(meRes.status, 200)
	  users[i] = meRes.body.data

	  // Check if proof_of_status is uploaded
	  t.is(meRes.body.data.proof_of_status, verifyRes.body.data.proof_of_status)

	  // Send Verify email

	  const emailRes = await request(app)
	  	.post(`/api/user/verify/email`)
	  	.set({ 'Content-Type': 'application/json', Authorization: tokens[i] })

	  t.is(emailRes.status, 200)

	  const verifyObj = await Verify.findOne({
	  	where: {
	  		user_id: meRes.body.data.id,
	  		type: 'email'
	  	}
	  })

	  t.is(verifyObj.user_id, meRes.body.data.id)

	  const verifyEmailGetRes = await request(app)
	  	.get('/api/user/verify/email/' + verifyObj.code)

	  t.is(verifyEmailGetRes.status, 200)

	  // Send SMS
	  const smsRes = await request(app)
	  	.post(`/api/user/verify/sms`)
	  	.set({ 'Content-Type': 'application/json', Authorization: tokens[i] })

	  t.is(smsRes.status, 200)

	  const smsVerifyObj = await Verify.findOne({
	  	where: {
	  		user_id: meRes.body.data.id,
	  		type: 'sms'
	  	}
	  })

	  t.is(smsVerifyObj.user_id, meRes.body.data.id)

	  const verifySmsRes = await request(app)
	  	.get('/api/user/verify/sms/' + smsVerifyObj.code)
	  	.set({ 'Content-Type': 'application/json', Authorization: tokens[i] })

	  t.is(verifySmsRes.status, 200)
	}

	// user_name login
  const resLoginUsername = await request(app)
    .post(`/api/user/login`)
    .set({ 'Content-Type': 'application/json' })
    .send({
			'user_name': 'test1',
			'password': '1234561'
    })

  t.is(resLoginUsername.status, 200)

  // Test user query
  const userQueryRes = await request(app)
  	.get(`/api/user?not_me`)
	  .set({ 'Content-Type': 'application/json', Authorization: tokens[0] })

	t.is(userQueryRes.status, 200)
	const { data } = userQueryRes.body

	// Current user should not be here
	t.is(data.findIndex((u) => u.id === users[0].id), -1)

  const categoriesRequests = [
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
    }, {
    	type: 'test1',
    	description: 'test1'
    }, {
    	type: 'test2',
    	description: 'test2',
    }, {
    	type: 'test3',
    	description: 'test3'
    }, {
    	type: 'test4',
    	description: 'test4'
    }]

  for (let i in categoriesRequests) {
	  const res = await request(app)
	    .post(`/api/category`)
	    .set({ 'Content-Type': 'application/json', 'Authorization': tokens[0] })
	    .send(categoriesRequests[i])
	 	
	 	t.is(res.status, 200)
	 	categories[i] = res.body.data
  }

  // Create 10 posts per user 

  for (let i in tokens) {
  	// Upload file
  	const fileRes = await request(app)
	    .post(`/api/file`)
	    .set({ 'Content-Type': 'application/json', Authorization: tokens[i] })
	    .send({
	    	file: strImage
	    })

	  t.is(fileRes.status, 200)
	  posts[i] = []

	  for (let j = 0; j < 10; j ++) {
	  	const res = await request(app)
		    .post(`/api/post`)
		    .set({ 'Content-Type': 'application/json', Authorization: tokens[i] })
		    .send({
		    	category_id: categories[j % categories.length].id,
		    	picture: fileRes.body.data.url,
		    	description: `Post_${j}_test${i}`
		    })
		   t.is(res.status, 200)

		   posts[i].push(res.body.data)
	  }
  }

  // Test count api
  const countRes = await request(app)
  	.get(`/api/post/count?user_id=${users[0].id}`)
    .set({ 'Content-Type': 'application/json', Authorization: tokens[0] })

  t.is(countRes.status, 200)
  t.is(countRes.body.status, true)
  t.is(countRes.body.data.count, 10)

  // Try to create another post for the same category
	const dPostRes = await request(app)
    .post(`/api/post`)
    .set({ 'Content-Type': 'application/json', Authorization: tokens[0] })
    .send({
    	category_id: categories[0].id,
    	picture: 'invalid_picture',
    	description: `invalid_post`
    })
  t.is(dPostRes.status, 400)

  // Query posts using createdAt
  const rangeQueryPostRes = await request(app)
  	.get(`/api/post?cfrom=${Lib.getToday()}&cto=${Lib.getTomorrow()}`)
  	.set({ 'Content-Type': 'application/json', Authorization: tokens[0] })

  t.is(rangeQueryPostRes.status, 200)
  t.is(rangeQueryPostRes.body.status, true)
  t.is(rangeQueryPostRes.body.data.length, 10) // 10 is default limit

    // Test get single post
  const singleGetRes = await request(app)
    .get(`/api/post/${posts[0][0].id}`)
    .set({ Authorization: tokens[0] })

  t.is(singleGetRes.status, 200)
  t.is(singleGetRes.body.status, true)
  t.is(singleGetRes.body.data.id, posts[0][0].id)

  // Vote category
  const voteCatRes = await request(app)
    .post(`/api/category/${categories[0].id}/vote`)
    .set({ 'Content-Type': 'application/json', Authorization: tokens[0] })
    .send({
    	commend: true
    })


  t.is(voteCatRes.status, 200)
  t.is(voteCatRes.body.status, true)
  t.is(voteCatRes.body.data.user_id, users[0].id)
  t.is(voteCatRes.body.data.commend, true)
  t.is(voteCatRes.body.data.category_id, categories[0].id)

  // Get category

  const getCatRes = await request(app)
    .get(`/api/category/${categories[0].id}`)
    .set({ 'Content-Type': 'application/json', Authorization: tokens[0] })
  
  t.is(getCatRes.status, 200)
  t.is(getCatRes.body.data.id, categories[0].id)

  const cancelVoteCatRes = await request(app)
    .post(`/api/category/${categories[0].id}/vote/cancel`)
    .set({ 'Content-Type': 'application/json', Authorization: tokens[0] })
    
  t.is(cancelVoteCatRes.status, 200)

  // Prevent self vote res
	// const selfVoteRes = await request(app)
 //    .post(`/api/post/${posts[0][0].id}/vote`)
 //    .set({ 'Content-Type': 'application/json', Authorization: tokens[0] })
 //    .send({
 //    	commend: true
 //    })
 //  t.is(selfVoteRes.status, 400)
 //  t.is(selfVoteRes.body.error, 'self_post')

  // test1 ~ test6 upvotes test0's first post
  // test7 ~ test9 downvotes test0's first post
  for (let i = 1; i <= 6; i ++) {
  	const res = await request(app)
	    .post(`/api/post/${posts[0][0].id}/vote`)
	    .set({ 'Content-Type': 'application/json', Authorization: tokens[i] })
	    .send({
	    	commend: true
	    })
	  t.is(res.status, 200)
  }

  // Query post
  const queryPostRes = await request(app)
    .get(`/api/post?keyword=Post_0`)
    .set({ Authorization: tokens[0] })

  t.is(queryPostRes.status, 200)
  t.is(queryPostRes.body.data.length, 10)
  t.is(queryPostRes.body.data[0].rank, 1)

	for (let i = 7; i <= 9; i ++) {
  	const res = await request(app)
	    .post(`/api/post/${posts[0][0].id}/vote`)
	    .set({ 'Content-Type': 'application/json', Authorization: tokens[i] })
	    .send({
	    	commend: false
	    })
	   	t.is(res.status, 200)
  }

  // test5, test6 reverts his upvotes to downvotes
	for (let i = 5; i <= 6; i ++) {
  	const res = await request(app)
	    .post(`/api/post/${posts[0][0].id}/vote`)
	    .set({ 'Content-Type': 'application/json', Authorization: tokens[i] })
	    .send({
	    	commend: false
	    })
	   t.is(res.status, 200)
  }

  // test6 cancels vote 
	const cancelVoteRes = await request(app)
    .post(`/api/post/${posts[0][0].id}/vote/cancel`)
    .set({ 'Content-Type': 'application/json', Authorization: tokens[6] })

  t.is(cancelVoteRes.status, 200)

  // test1 ~ test6 upvotes test0's second post
  for (let i = 1; i <= 6; i ++) {
  	const res = await request(app)
	    .post(`/api/post/${posts[0][1].id}/vote`)
	    .set({ 'Content-Type': 'application/json', Authorization: tokens[i] })
	    .send({
	    	commend: true
	    })
	   t.is(res.status, 200)
  }

  // test7 ~ test9 downvotes test0's second post
	for (let i = 7; i <= 9; i ++) {
  	const res = await request(app)
	    .post(`/api/post/${posts[0][1].id}/vote`)
	    .set({ 'Content-Type': 'application/json', Authorization: tokens[i] })
	    .send({
	    	commend: false
	    })
	  t.is(res.status, 200)
  }

  // test get me

  const meRes = await request(app)
  	.get(`/api/user/me`)
  	.set({ Authorization: tokens[0] })

  t.is(meRes.status, 200)

  // Remove user profile test

	const deleteMeRes = await request(app)
  	.get(`/api/user/me`)
  	.set({ Authorization: tokens[0] })

  t.is(deleteMeRes.status, 200)

})
