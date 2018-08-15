const fs = require('fs')

const fileupload = async(req, res) => {
    let type = req.body.type
    let imgData = req.body.img.replace(/^data:image\/png;base64,/, "")
    const imgname = new Date().getTime().toString()
    const path = process.env.UPLOAD_PATH + '/' + imgname + '.png'
    try {
        fs.writeFile(path, imgData, 'base64', function() {
            console.log("saved image on disk");
        });
    } catch (error) {
        console.log('ERROR:', error);
    }

    res.send(path)
}

module.exports = {
    fileupload
}