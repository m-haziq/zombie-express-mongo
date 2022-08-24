const express = require("express");
const mongoose = require("mongoose");
const Router = require("./routes");
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(express.json());
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

app.use(Router);

if (process.env.NODE_ENV !== 'test') {
app.listen(3000, () => {
    console.log("Server is running at port 3000");
});}





module.exports = app