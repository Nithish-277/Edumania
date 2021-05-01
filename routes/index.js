const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const jwt = require("jsonwebtoken");
var user;
// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, (req, res) => {
  const token = jwt.sign({ _id: req.user._id }, "asdfghjhgfdsasdfghhgfd", {
    expiresIn: 86400,
  });
  res.header("auth-token", token);
  res.render("dashboard", {
    user: req.user,
    token: token,
  });
});

module.exports = {
  router: router,
  user: user,
};
