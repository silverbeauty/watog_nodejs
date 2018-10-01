const uuidv1 = require('uuid/v1')

const User = require('../models/user')
const Member = require('../models/member')
const Room = require('../models/room')


const create = async (req, res) => {
	const roomObj = req.body
	const aryMemberId = roomObj.members

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

module.exports = {
	create
}