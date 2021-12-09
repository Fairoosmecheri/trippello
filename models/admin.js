const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let admin = new Schema({
  email: String,
  password: String,
});

const model = mongoose.model("admin", admin);

module.exports = model;