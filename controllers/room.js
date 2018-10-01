const uuidv1 = require('uuid/v1')

const User = require('../models/user')
const Member = require('../models/member')
const Room = require('../models/room')

const userFields = ['id', 'first_name', 'last_name', 'hospital', 'picture_profile', 'user_name', 'country']

const create = async (req, res) => {
	const roomObj = req.body
	const aryMemberId = roomObj.members

	// TODO: should check duplicated ids
	aryMemberId.push(req.currentUser.id)

	// delete member array
	delete roomObj.members
	roomObj.user_id = req.currentUser.id

	let room = await new Room(roomObj).save()

	if (Array.isArray(aryMemberId)) {
		const members = await Member.bulkCreate(aryMemberId.map(m => {
			return {
				user_id: m,
				room_id: room.id
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
			include: [{ model: User}]
		}, {
			model: User
		}]
	})

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

	res.send({
		status: true,
		data: room
	})
}

const query = async (req, res) => {
	const { query } = req

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
			where: { user_id: currentUser.id }
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

module.exports = {
	queryMyRooms,
	query,
	get,
	create
}