const mongoose = require("mongoose")
const { Schema } = mongoose

const jobsSchema = new mongoose.Schema({
    autoParked: Boolean,
    isSpecial: Boolean,
    cargo: {
        mass: Number,
        unitMass: Number,
        damage: Number,
        isLoaded: Boolean,
        id: String,
        name: String,
    },
    market: {
        id: String,
        name: String,
    },
    cargoDamage: Number,
    distance: {
        km: Number,
        miles: Number,
    },
    earnedXP: Number,
    expectedDeliveryTimestamp: {
        value: Number,
        unix: Number,
    },
    deliveredTimestamp: {
        value: Number,
        unix: Number,
    },
    plannedDistance: {
        km: Number,
        miles: Number,
    },
    revenue: {
        rub: Number,
        euro: Number,
    },
    startedTimestamp: {
        value: Number,
        unix: Number,
    },
    timeTaken: Number,
    jobTime: Number,
    destination: {
        city: {
            id: String,
            name: String,
        },
        company: {
            id: String,
            name: String,
        }
    },
    source: {
        city: {
            id: String,
            name: String,
        },
        company: {
            id: String,
            name: String,
        }
    },
    truck: {
        brand: String,
        model: String,
    },
    userAdded: String, // random hash
}, {
    versionKey: false,
    timestamps: true,
})

jobsSchema.plugin(require('./plugins/dateFormat').declareFormat('DD.MM.YYYY HH:mm:ss'))
jobsSchema.plugin(require('mongoose-autopopulate'))
const Jobs = mongoose.model('jobs', jobsSchema, 'jobs')

module.exports = Jobs
