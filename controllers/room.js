const uuidv1 = require('uuid/v1')
const Sequelize = require('sequelize')

const User = require('../models/user')
const Member = require('../models/member')
const Room = require('../models/room')
const RoomReport = require('../models/room_report')
const Message = require('../models/message')
const ChatCtrl = require('./chat')

const { Op } = Sequelize

const userFields = ['id', 'first_name', 'last_name', 'hospital', 'picture_profile', 'user_name', 'country']

const create = async (req, res) => {
	const roomObj = req.body
	let aryMemberId = roomObj.members

	// TODO: should check duplicated ids
	aryMemberId.push(req.currentUser.id)

	aryMemberId = aryMemberId.filter((elem, pos) => {
	    return aryMemberId.indexOf(elem) == pos
	})

	// delete member array
	delete roomObj.members
	roomObj.user_id = req.currentUser.id

	let room = await new Room(roomObj).save()

	if (Array.isArray(aryMemberId)) {
		const members = await Member.bulkCreate(aryMemberId.map(m => {
			return {
				user_id: m,
				room_id: room.id,
				removed: false
			}
		}))		
	}

	// Load room again

	room = await Room.findOne({
		where: {
			id: room.id
		},
		include: [{
			model: Member,
			include: [{ model: User, attributes: userFields }]
		}, {
			model: User, attributes: userFields
		}]
	})

	// Emit signals in new room
	ChatCtrl.notifyNewRoom(room)

	res.send({
		status: true,
		data: room
	})
}

const get = async (req, res) => {
	const { id } = req.params
	const room = await Room.findOne({
		where: { id },
		include: [{
			model: Member,
			include: [{ model: User, attributes: userFields }]
		}, {
			model: User,
			attributes: userFields
		}]
	})

	if (!room) {
		return res.status(400).send({
			status: true,
			error: 'no_room'
		})
	}

	res.send({
		status: true,
		data: room
	})
}

const edit = async (req, res) => {
	const { id } = req.params
	let room = await Room.findOne({
		where: { id }
	})

	if (!room) {
		return res.status(400).send({
			status: true,
			error: 'no_room'
		})
	}

	if (room.user_id !== req.currentUser.id) {
		return res.status(400).send({
			status: true,
			error: 'invalid_permission'
		})
	}

	const { body } = req

	const fields = ['jobs', 'topics', 'title', 'description', 'countries', 'is_private', 'avatar', 'background', 'category_id', 'archived']
	
	const invalidFields = []

	for (let key in body) {
		if (fields.indexOf(key) < 0) { // It is not allowed
			invalidFields.push(key)
		}
	}

	if (invalidFields.length > 0) {
		return res.status(400).send({
			status: false,
			error: 'fields_not_allowed',
			fields: invalidFields
		})
	}

	// Assign to room
	for (let key in body) {
		room[key] = body[key]
	}

	await room.save()

	const result = await Room.findOne({
		where: { id },
		include: [{
			model: Member,
			include: [{ model: User, attributes: userFields }]
		}, {
			model: User,
			attributes: userFields
		}]
	})

	ChatCtrl.notifyRoomUpdate(result)
	
	res.send({
		status: true,
		data: result
	})

}

const query = async (req, res) => {
	const { query } = req
	

	if (query.title) {
		query.title = {
			[Op.like]: '%' + query.title + '%'
		}
	}

	if (query.description) {
		query.description = {
			[Op.like]: '%' + query.description + '%'
		}
	}	

	if (!('archived' in query)) {
		query.archived = {
			[Op.not]: true
		}
	}

	const rooms = await Room.findAll({
		where: query,
		include: [{
			model: Member,
			include: [{ model: User, attributes: userFields }]
		}, {
			model: User,
			attributes: userFields
		}]
	})

	res.send({
		status: true,
		data: rooms
	})
}

// Query my rooms I am the owner or a member
const queryMyRooms = async (req, res) => {
	console.info('queryMyRooms')
	const { currentUser } = req
	const memberRooms = await Room.findAll({
		where: {},
		include: [{
			model: Member,
			include: [{ model: User, attributes: userFields }],
			where: { user_id: currentUser.id, removed: false }
		}, {
				model: User,
				attributes: userFields
			}]
		})

	res.send({
		status: true,
		data: memberRooms
	})
}

const addMember = async (req, res) => {
	const { id } = req.params
	const { user_id } = req.body

	let room = await Room.findOne({ where: { id }	})

	// Check room
	if (!room) {
		return res.status(400).send({
			status: false,
			error: 'no_room'
		})
	}

	// check user
	const user = await User.findOne({ where: { id: user_id }})
	if (!user) {
		return res.status(400).send({
			status: false,
			error: 'no_user'
		})
	}

	// Check if owner
	// TODO: should check if admin
	if (room.user_id !== req.currentUser.id) {
		return res.status(400).send({
			status: false,
			error: 'no_permission'
		})
	}

	let member = await Member.findOne({
		where: {
			user_id,
			room_id: room.id
		}
	})

	if (member && !member.removed) {
		return res.status(400).send({
			status: false,
			error: 'already_added'
		})
	}

	if (member && member.removed) {
		member.removed = false;
		await member.save()
	} else {
		member = new Member({
			user_id,
			room_id: room.id,
			removed: false
		})
		await member.save()
	}

	// Should announce here

	// Load room again
	room = await Room.findOne({
		where: { id },
		include: [{
			model: Member,
			include: [{ model: User, attributes: userFields }]
		}, {
			model: User,
			attributes: userFields
		}]
	})

	res.send({
		status: true,
		data: room
	})
}

const getMessages = async (req, res) => {
	const room = await Room.findOne({ where: { id: req.params.id }})
	if (!room) {
		return res.status(400).send({
			success: false,
			error: 'no_room'
		})
	}

	const { query } = req
	const where = {}
	const limit = query.limit || 10
	const order = query.order || 'createdAt'
	const direction = query.direction || 'ASC'
	const { text } = query

	where.room_id = room.id

	where['createdAt']= {
		[Op.lte]: new Date(query.to || new Date()),
		[Op.gt]: new Date(query.from || new Date(0))
	}

	if (text) {
		where['text'] = {
			[Op.like]: '%' + text + '%'
		}
	}

	const messages = await Message.findAll({ 
		where, 
		limit,
		include: [{ model: Member, include: [{ model: User, attributes: userFields }]}],
		order: [[order, direction]]
	})

	res.send({
		status: true,
		data: messages
	})
}

const report = async (req, res) => {
	const { id } = req.params
	const room = await Room.findOne({ where: { id }})
	if (!room) {
		return res.status(400).send({
			status: false,
			error: 'no_room'
		})
	}
	const { type, description } = req.body

	const roomReport = await new RoomReport({
		user_id: req.currentUser.id,
		room_id: room.id,
		type, 
		description
	}).save()

	console.info('ReportBody:', roomReport)

	res.send({
		status: true,
		data: roomReport
	})
}

module.exports = {
	queryMyRooms,
	query,
	get,
	edit,
	create,
	addMember,
	getMessages,
	report
}
