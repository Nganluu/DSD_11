const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const monitoredZoneSchema = new Schema({
    area: {
        type: Schema.Types.ObjectId,
        ref: 'MonitoredArea',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    startPoint: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    },
    endPoint: {
        longitude: {
            type: Number,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        }
    },
    priority: {
        type: Number
    },
    drone: [{
        type: Schema.Types.ObjectId
    }],
    desciption: {
        type: String
    },
    times: {
        type: Number
    },
    level: {
        type: Number
    }
}, {
    timestamps: true
})

const MonitoredZone = mongoose.model("MonitoredZone", monitoredZoneSchema) 

module.exports = MonitoredZone