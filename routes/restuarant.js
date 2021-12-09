var express = require("express");
var router = express.Router();
const userModel = require("../models/user");
var userHelper = require("../helpers/user-helper");
const auth = require('../middlewares/auth')
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')


const verifyLogin = (req, res, next) => {
    if (req.session.restuarant) {
      next();
    } else {
      res.redirect("/restuarant/login");
    }
  };
  router.get("/login", (req, res) => {
    res.render("restuarant/login", { restuarant: true });
  });
  
  router.post("/login", (req, res) => {
    if (req.body.Email === "admin@gmail.com" && req.body.Password == "admin") {
      req.session.restuarant = req.body.Email;
      req.session.restuarantLoggedIn = true;
      res.redirect("/restuarant/");
    }
  });
  router.get("/", verifyLogin, (req, res) => {
    res.render("restuarant/dashboard", {
        restuarant: true,
        restuarantLoggedIn: req.session.restuarantLoggedIn,
    });
  });
  
  router.get("/logout", (req, res) => {
    req.session.restuarant = null;
    res.redirect("/restuarant");
  });

module.exports = router;
