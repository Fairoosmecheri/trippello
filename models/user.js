const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let user = new Schema({
  email: String,
  fullname: String,
  phone: String,
  password: String,
  token: String,
});

const model = mongoose.model("user", user);

module.exports = model;