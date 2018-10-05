const express = require('express')

// Get a video list
router.get('/:id', catchError(FileCtrl.get))

module.exports = router
