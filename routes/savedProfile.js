require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var cities = require("all-countries-and-cities-json");
var indianCities = cities["India"];
var mongoose = require("mongoose");
var middleware = require("../middleware");

//SAVING A USER

router.post(
  "/saved/:clickedUser_id",
  middleware.isLoggedIn,
  function (req, res) {
    User.findById(req.params.clickedUser_id, function (err, foundUser) {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        req.user.savedUser.push(foundUser);
        req.user.save();
        res.redirect("/profile/" + req.params.clickedUser_id);
      }
    });
  }
);

// SHOWING A SAVED USER

router.get(
  "/savedProfiles/:loggedInUser_id",
  middleware.isLoggedIn,
  function (req, res) {
    User.findById(req.params.loggedInUser_id)
      .populate("savedUser")
      .exec(function (err, loggedInUser) {
        if (err) {
          console.log(err);
          res.redirect("viewProfile");
        } else {
          res.render("savedProfiles", { user: loggedInUser });
        }
      });
  }
);

// UNSAVING A USER

router.get("/unsave/:unsaveUser_id", function (req, res) {
  User.findById(req.params.unsaveUser_id, function (err, unsaveUser) {
    if (err) {
      console.log(err);
      res.redirect("/profile/" + req.params.unsaveUser_id);
    } else {
      req.user.savedUser.pull(unsaveUser);
      req.user.save();
      res.redirect("/profile/" + req.params.unsaveUser_id);
    }
  });
});

module.exports = router;
