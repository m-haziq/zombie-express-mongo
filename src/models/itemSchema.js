const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    point: {
        type: Number,
        required: true,
        default: 0
    }
})
const Items = mongoose.model('Item', ItemSchema)
module.exports = { Items, ItemSchema }