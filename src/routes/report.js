const express = require("express");
const Survivor = require("../models/survivorSchema").Survivor
const Inventory = require('../models/inventorySchema').Inventory
const Items = require('../models/itemSchema').Items
const auth = require('../middleWare/auth')
const checkInfectedStatus = require('../middleWare/infectedStatus');


const app = express();


app.put("/infected/:id", auth, checkInfectedStatus, async (req, res) => {

    let reportedId = req.params.id
    let repotedBy = req.user._id.toString()

    try {
        if (reportedId === repotedBy) {
            throw Error('Invalid report id.');
        }

        let survivor = await Survivor.findById(req.params.id)
        if (survivor) {
            survivor.report = survivor.report + 1
            if (survivor.report >= 3) {
                survivor.infected = true;
            }
        }
        await survivor.save()

        return res.status(200).send({ "message": "Reported Sucessfully" });

    } catch (e) {
        return res.status(400).send(String(e));
    }

});

app.get("/average-resources/", async (req, res) => {

    let items = await Items.find();
    let survivors = await Survivor.find({ infected: false });
    let survivors_ids = survivors.map((obj) => obj._id);
    let inventories = await Inventory.find({ "owner": { $in: survivors_ids } });
    let response = [];
    items.forEach(item_element => {
        response_obj = {
            "Item": item_element.name
        }
        quantity = 0
        inventories.forEach((inventory) => {
            inventory.items.forEach(inventory_item => {
                if (inventory_item.item.toString() == item_element._id.toString()) {
                    quantity = quantity + inventory_item.quantity;
                }
            });
        });
        item_average = 0;
        if (quantity) {
            item_average = quantity / survivors_ids.length;
        }
        response_obj["average"] = item_average;
        response.push(response_obj);
    });

    res.status(200).send(response);

});



app.get('/points-lost/', auth, async (req, res) => {
    var total_points = 0

    let survivors = await Survivor.find({ infected: true });
    let survivors_ids = survivors.map((obj) => obj._id);
    let inventories = await Inventory.find({ "owner": { $in: survivors_ids } }).populate('items.item');

    inventories.map((inventory, index) => {
        inventory.items.map((item, index) => {
            if (item?.item?.point) {
                total_points = total_points + (item?.item.point * item?.quantity)
            }
        })
    })

    res.status(200).send(`points lost=${total_points}`)


})






app.get('/percentage-per-resource', auth, async (req, res) => {
    let user_id = req.user._id
    let total_resource = 0
    let percentage_per_resource = []

    const user_inventory = await Inventory.findOne({ owner: user_id }).populate('items.item')

    user_inventory.items.map((item, index) => {
        total_resource = total_resource + item?.quantity
    })


    user_inventory.items.map((item, index) => {
        let avg = (item.quantity / total_resource) * 100
        let obj = {
            name: item?.item.name,
            percentage: avg
        }
        percentage_per_resource.push(obj)
    })

    return res.status(200).send(`total resource = ${JSON.stringify(percentage_per_resource)}`)
})


module.exports = app;