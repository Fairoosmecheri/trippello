const dotenv = require("dotenv");
dotenv.config();
const client = require("twilio")(
  process.env.TWILLIO_SID,
  process.env.TWILLIO_TOKEN
);
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken')
const userModel = require("../models/user");

module.exports = {
  sendOtp: (phone) => {
    return new Promise((resolve, reject) => {
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true,
      });
      client.messages
        .create({
          body: `Welcome to Trippello. Your OTP is ${otp}`,
          from: process.env.TWILLIO_FROM,
          to: "+919020061830",
          //   to: phone,
        })
        .then((message) => {
          console.log(message.sid);
          resolve(otp);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  },
  checkEmailExists: (email) => {
    return new Promise((resolve, reject) => {
      userModel.findOne({ email: email }, (err, user) => {
        if (user == null) {
          resolve({ userExists: false });
        } else {
          resolve({ userExists: true });
        }
      });
    });
  },
  doRegister: (email, phone, fullname, password) => {
    return new Promise(async (resolve, reject) => {
      password = await bcrypt.hash(password, 10);
      var new_user = await userModel.create({
        email: email,
        fullname: fullname,
        password: password,
        phone: phone,
      });
      const token = jwt.sign(
        { user_id: new_user._id, email },
        process.env.TOKEN_KEY,
      );
      new_user.token = token;
      console.log("HWLLO" + new_user)
      resolve(new_user);
    });
  },
  doLogin: (email, password) => {
      return new Promise(async (resolve, reject) => {
        const user = await userModel.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
              { user_id: user._id, email },
              process.env.TOKEN_KEY,
            );
            user.token = token;
            resolve(user)
          }
      })
  }
};
