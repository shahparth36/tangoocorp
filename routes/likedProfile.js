require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var mongoose = require("mongoose");
var middleware = require("../middleware");

router.post(
  "/liked/:clickedUser_id",
  middleware.isLoggedIn,
  function (req, res) {
    User.findById(req.params.clickedUser_id, function (err, foundUser) {
      if (err) {
        console.log(err);
        res.redirect("back");
      } else {
        req.user.likedUser.push(foundUser);
        foundUser.likedBy.push(req.user._id);
        req.user.save();
        foundUser.save();
        res.redirect("/profile/" + req.params.clickedUser_id);
      }
    });
  }
);

router.get(
  "/likedProfiles/:id",
  middleware.isLoggedIn,
  async function (req, res) {
    await User.findById(req.params.id)
      .populate("likedUser")
      .exec(async function (err, foundUser) {
        if (err) {
          console.log(err);
          res.redirect("viewProfile");
        } else {
          await User.find({
            //ignoring the currently loggedin user
            _id: {
              $ne: req.user,
            },
          }).exec(async function (err, allUsers) {
            if (err) {
              console.log(err);
              return res.redirect("back");
            }
            var arr = [];
            //looping through all users
            await allUsers.forEach(function (user) {
              //check if logged in user id exists in other users likedUser array
              if (user.likedUser.indexOf(req.user._id) !== -1) {
                // pushing other user object in an array
                arr.push(user);
              }
            });
            res.render("likedProfiles", { user: foundUser, arr: arr });
          });
        }
      });
  }
);

router.get(
  "/unlike/:unlikeUser_id",
  middleware.isLoggedIn,
  function (req, res) {
    User.findById(req.params.unlikeUser_id, function (err, unlikeUser) {
      if (err) {
        console.log(err);
        res.redirect("/profile/" + req.params.unlikeUser_id);
      } else {
        req.user.likedUser.pull(unlikeUser);
        req.user.save();
        res.redirect("/profile/" + req.params.unlikeUser_id);
      }
    });
  }
);

module.exports = router;
