const mongoose = require("mongoose");
require("dotenv").config();

async function dbConnect() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("Successfully connected to mongoDB");
    })
    .catch((err) => {
      console.log("There was an error connecting to mongoDB");
      console.log(err);
    });
}

module.exports = dbConnect;
