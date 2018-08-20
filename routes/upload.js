const express = require('express')

const { check, validationResult } = require('express-validator/check')

const UploadCtrl = require('../controllers/upload')

var multer = require('multer');
var fs = require('fs');

const router = express.Router()


router.post('/' ,multer({dest: './uploads/'}).array('uploads', 1), function(req,res,next) {
  var fileInfo = [];
  if(req.files.length > 0){
    req.body.pictures = new Buffer(fs.readFileSync(req.files[0].path)).toString('base64');
  }

  fs.unlink(req.files[0].path);
  next();
}, UploadCtrl.createUpload);

module.exports = router
