var express = require("express");
var router = express.Router();
const dotenv = require("dotenv");
dotenv.config();
const adminModel = require("../models/admin");
const restuarantModel = require("../models/restuarant");
var nodemailer = require("nodemailer");
var generator = require("generate-password");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_ID,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const verifyLogin = (req, res, next) => {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};
router.get("/login", (req, res) => {
  res.render("admin/login", { admin: true });
});

router.post("/login", (req, res) => {
  if (req.body.Email === "admin@gmail.com" && req.body.Password == "admin") {
    req.session.admin = req.body.Email;
    req.session.adminLoggedIn = true;
    res.redirect("/admin/");
  }
});
router.get("/", verifyLogin, (req, res) => {
  res.render("admin/dashboard", {
    admin: true,
    adminLoggedIn: req.session.adminLoggedIn,
  });
});

router.get("/logout", (req, res) => {
  req.session.admin = null;
  res.redirect("/admin");
});

router.get("/restuarants", verifyLogin, async (req, res) => {
  var restuarants = await restuarantModel.find();
  console.log(restuarants);
  res.render("admin/restuarants", {
    admin: true,
    adminLoggedIn: req.session.adminLoggedIn,
    restuarants: restuarants,
  });
});

router.get("/add-restuarant", verifyLogin, (req, res) => {
  res.render("admin/add-restuarant", {
    admin: true,
    adminLoggedIn: req.session.adminLoggedIn,
  });
});
router.post("/add-restuarant", verifyLogin, (req, res) => {
  restuarantModel.findOne({ email: req.body.email }, (err, restuarant) => {
    if (restuarant == null) {
      var password = generator.generate({
        length: 10,
        numbers: true,
      });
      var new_restuarant = new restuarantModel({
        email: req.body.email,
        name: req.body.name,
        password: password,
      });
      new_restuarant.save((err, result) => {
        if (err) {
          console.log(err);
        } else {
          // Sending login credentials to restuarant
          // var mailOptions = {
          //   from: process.env.GMAIL_ID,
          //   to: req.body.email,
          //   subject: "Trippello Login Details",
          //   html: `<h1>Welcome to Trippello</h1><p>Your login details are:</p><p>Restuarant Name: ${req.body.name}<br>Email Id: ${req.body.email}<br>Password: ${password}</p> `,
          // };
          // transporter.sendMail(mailOptions, function (error, info) {
          //   if (error) {
          //     console.log(error);
          //     res.render("admin/add-restuarant", { mailError: true });
          //   } else {
          //     console.log("Email sent: " + info.response);
          //   }
          // });
        }
      });
      res.redirect("/admin/restuarants");
    } else {
      res.render("admin/add-restuarant", {
        admin: true,
        adminLoggedIn: req.session.adminLoggedIn,
        loginErr: true,
      });
    }
  });
});

router.get("/own-packages", verifyLogin, (req, res) => {
  res.render("admin/own-packages", {
    admin: true,
    adminLoggedIn: req.session.adminLoggedIn,
  });
});
router.get("/add-own-packages", verifyLogin, (req, res) => {
  res.render("admin/add-own-packages", {
    admin: true,
    adminLoggedIn: req.session.adminLoggedIn,
  });
});

module.exports = router;
