const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let restuarant = new Schema({
  email: String,
  name: String,
  password: String,
});

const model = mongoose.model("restuarant", restuarant);

module.exports = model;