
const express = require("express");
const nodemon = require("nodemon");
const InventorySchema = require("../models/inventorySchema").Inventory;
const auth = require('../middleWare/auth')
const checkInfectedStatus = require("../middleWare/infectedStatus");
const { Inventory } = require("../models/inventorySchema");



const app = express();


app.post("/add", auth, checkInfectedStatus, async (req, res) => {

    let userId = req.user?._id;
    let inventor_count = await InventorySchema.find({ owner: userId });
    try {
        if (inventor_count?.length) {
            throw Error('Inventory already exist.');
        }

        const inventor_schema = new InventorySchema({
            owner: req?.user?._id,
            items: req?.body.items
        });
        response = await inventor_schema.save();
        return res.status(201).send(response);

    } catch (e) {
        return res.status(400).send(String(e));
    }

});

app.get("/get", auth, checkInfectedStatus, async (req, res) => {

    let userId = req.user?._id;
    response_data = await Inventory.findOne({"owner":userId}).populate("items.item");
    return res.status(200).send(response_data);

});

module.exports = app;