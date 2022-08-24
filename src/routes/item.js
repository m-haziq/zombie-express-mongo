
const express = require("express");
const itemModel = require("../models/itemSchema").Items;
const auth = require('../middleWare/auth')


const app = express();


app.post("/add", auth, async (req, res) => {

    const item = new itemModel({
        name: req.body.name,
        point: req.body.point
    });
    await item.save()
        .then(item => res.status(201).send(item))
        .catch(err => res.status(400).send(err))
});

app.get("/get", auth, async (req, res) => {
    try {
        const items = await itemModel.find()
        return res.status(200).send(items)
    } catch (error) {
        console.log('error while getting items', error)
    }
});

app.get("/get/:id", auth, async (req, res) => {
    try {
        const items = await itemModel.findById(req.params.id)
        return res.status(200).send(items)
    } catch (error) {
        console.log('error while getting items by id', error)
    }

});


app.patch("/update/:id", auth, async (req, res) => {
    try {
        const item = await itemModel.findById(req.params.id)

        if (req.body.name) {
            item.name = req.body.name
        }
        if (req.body.point) {
            item.point = req.body.point
        }
        await item.save()

        return res.status(200).send(item)
    } catch (error) {
        console.log('error while getting items by id', error)
    }

});

app.put("/delete/:id", auth, async (req, res) => {
    try {
        const item = await itemModel.findByIdAndRemove(req.params.id)

        if (!item) {
            res.status(404).send(`Can not delte item wiht id=${req.params.id}`)
        } else {
            res.status(200).send(`item deleted successfully`)
        }

    } catch (error) {
        console.log('error while getting items by id', error)
    }

});





module.exports = app;