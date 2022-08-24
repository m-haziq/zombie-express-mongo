
const express = require("express");
const survivorModel = require("../models/survivorSchema").Survivor;
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const auth = require('../middleWare/auth')



function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET,);
}


const app = express();


app.post("/add", async (req, res) => {
    const token = generateAccessToken({ username: req.body.name });
    // console.log('token is', req.body)

    const user = new survivorModel({
        name: req.body.name,
        gender: req.body.gender,
        age: req.body.age,
        location: req.body.location,
        infected: req.body.infected,
        report: req.body.report,
        token: token

    });
    await user.save()
        .then(user => res.status(201).send(user))
        .catch(err => res.status(400).send(err))

});

app.get('/infected', auth, async (req, res) => {
    const findAll = await survivorModel.find()
    const infected = await survivorModel.find({ infected: true })

    let infected_percentage = 0
    let totalSurvival = findAll?.length
    let infected_Survival = infected?.length
    if (totalSurvival > 0) {
        infected_percentage = (infected_Survival / totalSurvival) * 100
    }

    return res.status(200).send(`${infected_percentage.toFixed(2)} % Survivors are infected`)

})

app.get('/non-infected', auth, async (req, res) => {
    const findAll = await survivorModel.find()
    const non_Infected = await survivorModel.find({ infected: false })

    let non_infected_percentage = 0
    let totalSurvival = findAll?.length
    let non_infected_Survival = non_Infected?.length
    if (totalSurvival > 0) {
        non_infected_percentage = (non_infected_Survival / totalSurvival) * 100
    }

    return res.status(200).send(`${non_infected_percentage.toFixed(2)} % Survivors are non-infected`)

})





module.exports = app;