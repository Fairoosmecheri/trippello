var express = require("express");
var router = express.Router();
const userModel = require("../models/user");
var userHelper = require("../helpers/user-helper");
const auth = require('../middlewares/auth')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')

router.post("/send-otp", (req, res) => {
  var phone = req.body.phone;
  console.log(phone);
  userHelper.sendOtp(phone).then((otp) => {
    console.log("OTP Send Successfully");
    res.send(otp);
  });
});

router.post("/check-email", (req, res) => {
  userHelper.checkEmailExists(req.body.email).then((response) => {
    res.send(response);
  });
});

router.post("/register", (req, res) => {
  userHelper
    .doRegister(
      req.body.email,
      req.body.phone,
      req.body.fullname,
      req.body.password
    )
    .then((user) => {
      res.send(user);
    });
});



router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  console.log(password);
  userHelper.doLogin(email, password).then((response) => {
    res.send(response);
  });
});

router.get('/', auth, (req, res) => {
  res.send("Hello")
})

module.exports = router;
