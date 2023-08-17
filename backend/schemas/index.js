const mongoose = require('mongoose')
mongoose.Promise = global.Promise

mongoose.set('strictQuery', true)

const db = {}

db.mongoose = mongoose
db.jobs = require('./jobs')

module.exports = db