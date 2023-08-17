const db = require('../schemas')
const {jsonResponse} = require('../utils')

const Jobs = db.jobs

exports.getUserJobs = async (req, res) => {
  const jobs = await Jobs.find({'userAdded': req.query.uuid}, null, {sort: {_id: -1}})
  
  return jsonResponse(res, jobs)
}

exports.addJob = async (req, res) => {
  const job = new Jobs(req.body)
  await job.save()
  return jsonResponse(res, job)
}
