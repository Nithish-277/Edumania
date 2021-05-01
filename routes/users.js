const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
var nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");
var otpGenerator = require("otp-generator");
const TwoFactor = new (require("2factor"))(
  "14e03aaa-a580-11eb-80ea-0200cd936042"
);

// Load User model
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get("/register", forwardAuthenticated, (req, res) =>
  res.render("register")
);

router.get("/verify", (req, res) => res.render("verify"));

var newUser;
var mobilestring;
var session;
var user_req;
var otp_mail;

var transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "btpmail286@gmail.com",
      pass: "btp861966",
    },
  })
);

var mailOptions = {
  from: "btpmail286@gmail.com",
  to: "",
  subject: "Verification code",
  text: "",
};

// Register
router.post("/register", async (req, res) => {
  const { name, email, mobile, password, password2 } = req.body;
  console.log(req.body);
  console.log(name);
  let errors = [];

  if (!name || !email || !mobile || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      mobile,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          mobile,
          password,
          password2,
        });
      } else {
        newUser = new User({
          name,
          email,
          mobile,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            mobilestring = mobile.toString();
            console.log("In Bcrypt");
            res.redirect("/users/sendotp");

            console.log(mobilestring);
          });
        });
      }
    });
  }
});

router.get("/sendotp", (req, res, next) => {
  console.log("InOTP");
  console.log(mobilestring);
  TwoFactor.sendOTP(mobilestring).then(
    (sessionId) => {
      session = sessionId;
    },
    (error) => {
      console.log(error);
    }
  );
  res.redirect("/users/verify");
});

router.post("/verify", (req, res, next) => {
  const { otp } = req.body;
  let errors = [];
  if (!otp) {
    errors.push({ msg: "Please enter OTP" });
  }
  if (errors.length > 0) {
    res.render("verify", {
      errors,
      otp,
    });
  } else {
    TwoFactor.verifyOTP(session, otp).then(
      (response) => {
        newUser
          .save()
          .then((user) => {
            req.flash("success_msg", "Account Created");
            res.redirect("/users/login");
          })
          .catch((err) => console.log(err));
      },
      (error) => {
        req.flash("error_msg", "Please re-enter the OTP");
        res.redirect("/users/verify");
      }
    );
  }
});

// Login
router.post("/login", (req, res, next) => {
  user_req = req.body;
  mailOptions["to"] = req.body.email;
  let mail_text = "OTP is ";
  otp_mail = otpGenerator.generate(6, {
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  mailOptions["text"] = mail_text.concat(otp_mail);
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent");
    }
  });
  res.redirect("/users/verifymail");
});

router.get("/verifymail", (req, res) => res.render("verifymail"));

router.post("/verifymail", (req, res, next) => {
  const { otp } = req.body;
  let errors = [];
  if (!otp) {
    errors.push({ msg: "Please enter OTP" });
  }
  if (errors.length > 0) {
    res.render("verifymail", {
      errors,
    });
  } else {
    if (otp === otp_mail) {
      res.redirect("/users/login_after_auth");
    } else {
      res.redirect("/users/login_after_auth");

      // req.flash("error_msg", "Please re-enter the OTP");
      // res.redirect("/users/verifymail");
    }
  }
});

router.get("/login_after_auth", (req, res, next) => {
  req.body = user_req;
  // const token = jwt.sign({ _id: user_req._id }, process.env.TOKEN_SECRET);
  // res.header("auth-token", token).send(token);

  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);

});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
