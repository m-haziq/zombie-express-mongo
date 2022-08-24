const mongoose = require("mongoose");

const SurvivorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        default: 0,
    },
    gender: {
        type: String
    },
    location: {
        lat: { type: String },
        long: { type: String }
    },
    infected: {
        type: Boolean,
        required: true,
        default: false
    },
    report: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }
});

const Survivor = mongoose.model("Survivor", SurvivorSchema);
module.exports = { Survivor, SurvivorSchema }