require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var cities = require("all-countries-and-cities-json");
var indianCities = cities["India"];
var middleware = require("../middleware");

router.get("/explore", middleware.isLoggedIn, function (req, res) {
  var perPage = 9;
  var pageQuery = parseInt(req.query.page);
  var pageNumber = pageQuery ? pageQuery : 1;
  var noMatch = null;
  if (Object.keys(req.query).length > 0) {
    User.find(filter(req))
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, allUsers) {
        User.count().exec(function (err, count) {
          if (err) {
            console.log(err);
            req.flash("error", "Something went wrong.");
            return res.redirect("back");
          } else {
            if (allUsers.length < 1) {
              req.flash(
                "error",
                "No user exists according to your given criteria."
              );
              return res.redirect("/explore");
            }
            res.render("explore", {
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              foundUser: shuffle(allUsers),
              noMatch: noMatch,
              indianCities: indianCities,
            });
          }
        });
      });
  } else {
    //Get all users
    User.find({ _id: { $ne: req.user } })
      .skip(perPage * pageNumber - perPage)
      .limit(perPage)
      .exec(function (err, foundUser) {
        User.count().exec(function (err, count) {
          if (err) {
            console.log(err);
            res.redirect("back");
          } else {
            // render explore.ejs file
            res.render("explore", {
              current: pageNumber,
              pages: Math.ceil(count / perPage),
              foundUser: shuffle(foundUser),
              noMatch: noMatch,
              indianCities: indianCities,
            });
          }
        });
      });
  }
});

router.post("/explore", function (req, res) {
  User.find(
    {
      _id: {
        $ne: req.user,
      },
    },
    function (err, foundUser) {
      if (err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("back");
      }

      return res.redirect("/explore");
    }
  );
});
function filter(req) {
  var search1 = { _id: { $ne: req.user } };
  if (req.query.fullName) {
    search1.fullName = new RegExp(escapeRegex(req.query.fullName), "gi");
  }
  if (req.query.username) {
    search1.username = new RegExp(escapeRegex(req.query.username), "gi");
  }
  if (req.query.sexuality) {
    search1.sexuality = new RegExp(escapeRegex(req.query.sexuality), "gi");
  }
  if (req.query.gender) {
    if (req.query.gender === "Male") {
      search1.gender = "Male";
    }

    if (req.query.gender === "Female") {
      search1.gender = "Female";
    }

    if (req.query.gender === "Others") {
      search1.gender = "Others";
    }
  }
  if (req.query.city) {
    search1.city = new RegExp(escapeRegex(req.query.city), "gi");
  }
  if (req.query.age) {
    search1.age = {
      $gte: req.query.age[0],
      $lte: req.query.age[1],
    };
  }
  return search1;
}

function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

module.exports = router;
