const LiveVideo = require('../models/live')

const get = async (req, res) => {
	// https://www.googleapis.com/youtube/v3/playlists?channelId=UCL_KG4bwo7BsbU50jV_wNgg&part=snippet&key=AIzaSyAznLC1F29sn09_-gW-7E-i22a_U0r2I2g
	const video = await LiveVideo.findOne({
		where: {
			id: 1
		}
	})

	if (video) {
		res.send({
			status: true,
			data: {
				youtube_id: video.youtube_id
			}
		})
	} else {
		res.status({
			status: false,
			error: 'No live registered'
		})
	}
}

const set = async (req, res) => {
	await LiveVideo.remove({
		where: {
			id: 1
		}
	})

	const video = await new LiveVideo({
		id: 1,
		youtube_id: req.query.id
	}).save()

	res.send(`<h3>Live Stream</h3><p><a href="https://www.youtube.com/watch?v=${req.query.id}">
		https://www.youtube.com/watch?v=${req.query.id}
		</a></p>`)
}

module.exports = {
	get,
	set
}