require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var async = require("async");
var nodemailer = require("nodemailer");

router.get("/", (req, res) => {
  res.render("landing");
});

router.get("/privacy", (req, res) => {
  res.render("privacy");
});

router.get("/termsandconditions", (req, res) => {
  res.render("terms");
});

router.get("/guidelines", (req, res) => {
  res.render("guidelines");
});

router.get("/support", (req, res) => {
  res.render("support");
});

router.get("/safety", (req, res) => {
  res.render("safety");
});

router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
