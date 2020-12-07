const droneService = require('./itinerary.service');

exports.setItinerarytoZone = async (req, res) => {
    try {
        let data = req.body;
        let result = await droneService.setItinerarytoZone(data);
        res.status(200).json({
            success: true,
            message: "Set drone to zone successfully",
            content: result
        })

    }catch(error){
        res.status(400).json({
            success: false, 
            message: "Cannot set drone to zone",
            content: error.message
        })
    }
}

exports.getItinerarybyZone = async (req, res) => {
    try {
        let _id = req.params._id;
        let result = await droneService.getItinerarybyZone(_id);
        res.status(200).json({
            success: true,
            message: "Get drone by zone successfully",
            content: result
        })
    } catch (error){
        res.status(400).json({
            success: false, 
            message: "Cannot get drone by zone",
            content: error.message
        })
    }
}

exports.deleteItinerarybyZone = async (req, res) => {
    try {
        const data = req.body
        let result = await droneService.deleteItinerarytoZone(data);
        res.status(200).json({
            success: true,
            message: "delete drone by zone successfully",
            content: result
        })

    }catch(error){
        res.status(400).json({
            success: false, 
            message: "Cannot delete drone by zone",
            content: error.message
        })
    }
}

exports.deleteItineraryTest = async (req, res) => {
    try {
        var _id = req.params._id
        let result = await droneService.deleteItineraryTest(_id);
        res.status(200).json({
            success: true,
            message: "delete drone by zone successfully",
            content: result
        })

    }catch(error){
        res.status(400).json({
            success: false, 
            message: "Cannot delete drone by zone test",
            content: error.message
        })
    }
}