const { MonitoredZone } = require(SERVER_DIR + '/models');
const { MonitoredArea } = require(SERVER_DIR + "/models");
const { Incident } = require(SERVER_DIR + "/models")
const axios = require('axios')
var mongoose = require("mongoose")

exports.getZonebyArea = async (_id) => {
    const type = global.user.type
    let zone;
    if (type === "ALL_PROJECT") {
        zone = await MonitoredZone.find({ area: _id });
    } else {
        zone = await MonitoredZone.find({ area: _id, incidentType: type });
    }
    return { zone }
}

exports.getZonebyIncident = async (type) => {
    console.log(type)
    let zone = await MonitoredZone.find({ incidentType: type });
    return { zone }
}

exports.getAllZone = async (req) => {

    const page = Number(req.query.page);
    const pageSize = Number(req.query.pageSize);
    const limit = pageSize ? pageSize : 20;
    const offset = page ? page * limit : 0;

    let zone;
    let type = global.user.type;
    let size;
    if (type === "ALL_PROJECT") {
        zone = await MonitoredZone.find({}).sort({ 'createdAt': -1, 'priority': -1 }).skip(offset).limit(limit);
        size = await MonitoredZone.count({})
    } else {
        zone = await MonitoredZone.find({ incidentType: type }).sort({ 'createdAt': -1, 'priority': -1 }).skip(offset).limit(limit);
        size = await MonitoredZone.count({ incidentType: type })
    }


    return { zone: zone, page: page, pageSize: limit, totalPage: parseInt(size / limit) + 1, totalCount: size }
}

exports.getZonebyId = async (_id) => {
    let type = global.user.type
    let zonecheck = await MonitoredZone.findById(_id);
    let zone;

    if (zonecheck) {
        if (zonecheck.incidentType === type || type === "ALL_PROJECT") {
            zone = zonecheck

        } else {
            throw Error("Ban khong co quyen xem tai lieu nay.")
        }
    } else {
        throw Error("Khong ton tai zone")
    }
    return { zone }
}

exports.createZone = async (data, areaid) => {
    let type = global.user.type;
    let checkadmin = (global.user.role == "ADMIN");
    let checksuperadmin = global.user.role == "SUPER_ADMIN";
    let zone;
    if (checkadmin || checksuperadmin) {
        zone = await MonitoredZone.create({
            area: mongoose.Types.ObjectId(areaid),
            name: data.name ? data.name : "", //string
            code: data.code, //string
            minHeight: data.minHeight,
            maxHeight: data.maxHeight,
            startPoint: data.startPoint, //object longlat
            endPoint: data.endPoint, //object longlat
            priority: data.priority ? data.priority : 0,  //number
            itinerary: data.itinerary, //array 
            description: data.description ? data.description : "", //string
            active: data.active ? data.active : 1, //boolean
            incidentType: type, //id
            times: data.times ? data.times : 0,
            level: data.level ? data.level : 0
        })

        let area = await MonitoredArea.findById(mongoose.Types.ObjectId(areaid));
        area.monitoredZone.push(zone);
        await area.save()
    } else {
        throw Error("Ban khong co quyen tao tai lieu nay")
    }
    return { zone }
}

exports.deleteZone = async (_id) => {
    let zonecheck = await MonitoredZone.findById({ _id: _id });
    let zone;
    let area;
    let checkadmin = (global.user.role == "ADMIN" && zonecheck.incidentType === global.user.type);
    let checksuperadmin = global.user.role == "SUPER_ADMIN"
    if (checkadmin || checksuperadmin) {
        if (zonecheck) {
            zone = await MonitoredZone.findByIdAndDelete({ _id: _id });
            area = await MonitoredArea.findOne({ monitoredZone: _id })

            let index = area.monitoredZone.indexOf(zone._id);
            if (index > -1) {
                area.monitoredZone.splice(index, 1)
            }
            await area.save();
        } else {
            throw Error("Khong ton tai zone")
        }
    } else {
        throw Error("Ban khong co quyen xoa tai lieu nay.")
    }

    return { area }
}

exports.updateZone = async (_id, data) => {
    console.log(data)
    let zone = await MonitoredZone.findById(_id);
    let result;
    let checkadmin = (global.user.role == "ADMIN" && zone.incidentType === global.user.type);
    let checksuperadmin = global.user.role == "SUPER_ADMIN"
    if (checkadmin || checksuperadmin) {
        if (zone) {
            await MonitoredZone.update({ _id: _id }, { $set: data });
            result = await MonitoredZone.findById(_id);
        } else {
            throw Error("Cannot find zone")
        }
    } else {
        throw Error("Ban khong co quyen cap nhat tai lieu nay")
    }
    return { result }
}
exports.statisticFrequency = async () => {
    let data = await MonitoredZone.find().sort({ 'times': -1 }).select(['code', 'name', 'times', 'incidentType']);


    return { data }
}

exports.statisticLevel = async (level) => {
    let data;
    console.log(level)
    if (level == 0 || level == 1 || level == 2) {
        data = await MonitoredZone.find({ level: level });
    }
    else {
        data = "Donot have area in this level"
    }
    return { data }
}

exports.addType = async () => {
    let zone = await MonitoredZone.find();
    let type = ["CHAY_RUNG", "DE_DIEU", "CAY_TRONG", "LUOI_DIEN"];

    for (let i = 0; i < zone.length; i++) {
        let index = Math.floor(Math.random() * type.length)
        let incidentType = type[index]
        zone[i].incidentType = incidentType
        zone[i].save()
    }

    return { zone }
}

exports.filter = async (field) => {
    let zone = await MonitoredZone.find(field);
    return { zone }
}