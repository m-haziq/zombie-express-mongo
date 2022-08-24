
const express = require("express");
const Inventory = require("../models/inventorySchema").Inventory;
const ItemQuantity = require("../models/inventorySchema").ItemQuantity;
const Item = require('../models/itemSchema').Items;
const auth = require('../middleWare/auth');
const checkTradePossibility = require("../middleWare/tradeValidator");
const checkInfectedStatus = require("../middleWare/infectedStatus");




const app = express();


app.post("/:id", auth, checkInfectedStatus, checkTradePossibility, async (req, res) => {

    let source_id = req?.params?.id;
    let items_demand = req.body?.demand?.items;
    let items_offered = req.body?.offerd?.items;

    let source_inventory = await Inventory.findOne({ owner: source_id });
    let destination_inventory = await Inventory.findOne({ owner: req?.user?._id });

    // Logic for user inventory

    items_offered.forEach(element => {
        destination_inventory.items.map((inventory_item, indx) => {
            if (inventory_item.item == element.item) {
                if (inventory_item.quantity == element.quantity) {
                    destination_inventory.items.splice(indx, 1);

                } else {
                    inventory_item.quantity = inventory_item.quantity - element.quantity;
                    return inventory_item;

                }
            }
        });

        // Adding items to targeted inventory

        flag_item_exists = false;

        source_inventory.items.map((inventory_item) => {
            if (inventory_item.item == element.item) {
                inventory_item.quantity = inventory_item.quantity + element.quantity;
                flag_item_exists = true;
                return inventory_item;
            }
        });

        if (!flag_item_exists) {
            source_inventory.items.push(element);
        }
    });


    // Logic for destination inventory

    items_demand.forEach(element => {
        source_inventory.items.map((inventory_item, indx) => {
            if (inventory_item.item == element.item) {
                if (inventory_item.quantity == element.quantity) {
                    source_inventory.items.splice(indx, 1);

                } else {
                    inventory_item.quantity = inventory_item.quantity - element.quantity;
                    return inventory_item;

                }
            }
        });

        // Adding items to user's inventory

        flag_item_exists = false;

        destination_inventory.items.map((inventory_item) => {
            if (inventory_item.item == element.item) {
                inventory_item.quantity = inventory_item.quantity + element.quantity;
                flag_item_exists = true;
                return inventory_item;
            }
        });

        if (!flag_item_exists) {
            destination_inventory.items.push(element);
        }
    });

    source_inventory = await source_inventory.save();
    destination_inventory = await destination_inventory.save();

    response_data = {
        "source_inventory": source_inventory,
        "destination_inventory": destination_inventory
    }


    return res.status(200).send(response_data);

});


module.exports = app;