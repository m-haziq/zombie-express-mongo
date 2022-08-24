const express = require('express')
const survivorRoutes = require('./survivor')
const ItemRoutes = require('./item')
const inventoryRoutes = require('./inventory')
const reportRoutes = require('./report')
const tradeRoutes = require('./trade.js')


const router = express.Router()


router.use('/survivor', survivorRoutes)
router.use('/item', ItemRoutes)
router.use('/inventory', inventoryRoutes)
router.use('/report', reportRoutes)
router.use('/trade', tradeRoutes)



module.exports = router
