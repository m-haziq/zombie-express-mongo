const mongoose = require('mongoose')
const Survivor = require('./survivorSchema').SurvivorSchema
const Item = require('./itemSchema').ItemSchema


const InventorySchema = mongoose.Schema({
    owner: {
        type: mongoose.Types.ObjectId,
        ref: 'Survivor'

    },
    items: [{
        quantity: {
            type: Number,
            default: 1
        },
        item: {
            type: mongoose.Types.ObjectId,
            ref: 'Item'
        }
    }]


})
const Inventory = mongoose.model('Inventory', InventorySchema)
module.exports = { Inventory, InventorySchema }