const Survivor = require('../models/survivorSchema').Survivor

const checkInfectedStatus = async (req, res, next) => {
    const foundOne = await Survivor.findById(req?.user?._id);
    if (foundOne?.report >= 3 || foundOne.infected) {
        return res.status(400).send('You are not allowed to interact with the system.');
    }
    return next();
}

module.exports = checkInfectedStatus;