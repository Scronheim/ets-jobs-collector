const express = require('express')
const router = new express.Router()

const db = require('../queries/jobs')

router.route('/api/jobs')
  .get(db.getUserJobs)
  .post(db.addJob)

module.exports = router
