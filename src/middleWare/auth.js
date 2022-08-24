const jwt = require('jsonwebtoken');
const Survivor = require('../models/survivorSchema').Survivor
const config = process.env

const verifyToken = async (req, res, next) => {
    const token = req.headers['x-access-token']
    // const token = req.headers.authorization.split(" ")[1]
    if (!token) {
        return res.status(403).send('A token is required for Authentication')
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_SECRET)
        let userObj = ''
        if (decoded) {
            userObj = await Survivor.findOne({ token: token }).exec()
        }
        req.user = userObj
    } catch (error) {
        console.log('error ', error)
        return res.status(401).send('Invalid Token')
    }
    return next()
}

module.exports = verifyToken