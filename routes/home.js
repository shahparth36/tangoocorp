require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
var middleware = require("../middleware");

router.get("/home/:id", middleware.isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
      return res.redirect("back");
    } else {
      // Male User
      if (foundUser.gender === "Male") {
        // if user is straight
        if (foundUser.sexuality === "Straight") {
          // if user has selected short distance
          if (foundUser.relType === "Short Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Female",
                sexuality: "Straight",
                city: foundUser.city,
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }

          //if user has selected long distance

          if (foundUser.relType === "Long Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Female",
                sexuality: "Straight",
                city: {
                  $ne: foundUser.city,
                },
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }

          //if user has selected doesn't matter

          if (foundUser.relType === "Doesn't Matter") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Female",
                sexuality: "Straight",
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }
        }

        //if user is homosexual

        if (foundUser.sexuality === "Homosexual") {
          // if user has selected short distance

          if (foundUser.relType === "Short Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Male",
                city: foundUser.city,
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }
          // if user has selected Long distance

          if (foundUser.relType === "Long Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Male",
                city: {
                  $ne: foundUser.city,
                },
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }
          // if user has selected doesn't Matter

          if (foundUser.relType === "Doesn't Matter") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Male",
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }
        }
        //if user is bisexual

        if (foundUser.sexuality === "Bisexual") {
          // if user has selected short distance

          if (foundUser.relType === "Short Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                city: foundUser.city,
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }

          // if user has selected long distance

          if (foundUser.relType === "Long Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                city: {
                  $ne: foundUser.city,
                },
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }

          // if user has selected doesn't Matter

          if (foundUser.relType === "Doesn't Matter") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }
        }
      }
      // Female User
      if (foundUser.gender === "Female") {
        // if user is straight
        if (foundUser.sexuality === "Straight") {
          // if user has selected short distance
          if (foundUser.relType === "Short Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Male",
                sexuality: "Straight",
                city: foundUser.city,
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }

          // if user has selected long distance
          if (foundUser.relType === "Long Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Male",
                sexuality: "Straight",
                city: {
                  $ne: foundUser.city,
                },
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }

          // if user has selected doesn't Matter
          if (foundUser.relType === "Doesn't Matter") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Male",
                sexuality: "Straight",
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }
        }
        //if user is homosexual

        if (foundUser.sexuality === "Homosexual") {
          // if user has selected short distance

          if (foundUser.relType === "Short Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Female",
                city: foundUser.city,
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }
          // if user has selected Long distance

          if (foundUser.relType === "Long Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Female",
                city: {
                  $ne: foundUser.city,
                },
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }
          // if user has selected doesn't Matter

          if (foundUser.relType === "Doesn't Matter") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                gender: "Female",
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }
        }

        //if user is bisexual

        if (foundUser.sexuality === "Bisexual") {
          // if user has selected short distance

          if (foundUser.relType === "Short Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                city: foundUser.city,
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }

          // if user has selected long distance

          if (foundUser.relType === "Long Distance Relationships") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                city: {
                  $ne: foundUser.city,
                },
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }

          // if user has selected doesn't Matter

          if (foundUser.relType === "Doesn't Matter") {
            User.find(
              {
                _id: {
                  $ne: req.user,
                },
                age: {
                  $gte: foundUser.relInitialAge - 2,
                  $lte: foundUser.relFinalAge + 2,
                },
              },
              function (err, filteredUsers) {
                if (err) {
                  console.log(err);
                  return res.redirect("back");
                } else {
                  var arr = percentage(filteredUsers, req);
                  res.render("home", {
                    user: shuffle(arr),
                  });
                }
              }
            );
          }
        }
      }
      // Other Users
      if (foundUser.gender === "Others") {
        // if user has selected short distance
        if (foundUser.relType === "Short Distance Relationships") {
          User.find(
            {
              _id: {
                $ne: req.user,
              },
              gender: "Others",
              city: foundUser.city,
              age: {
                $gte: foundUser.relInitialAge - 2,
                $lte: foundUser.relFinalAge + 2,
              },
            },
            function (err, filteredUsers) {
              if (err) {
                console.log(err);
                return res.redirect("back");
              } else {
                var arr = percentage(filteredUsers, req);
                res.render("home", {
                  user: shuffle(arr),
                });
              }
            }
          );
        }
        // if user has selected long distance
        if (foundUser.relType === "Long Distance Relationships") {
          User.find(
            {
              _id: {
                $ne: req.user,
              },
              gender: "Others",
              city: {
                $ne: foundUser.city,
              },
              age: {
                $gte: foundUser.relInitialAge - 2,
                $lte: foundUser.relFinalAge + 2,
              },
            },
            function (err, filteredUsers) {
              if (err) {
                console.log(err);
                return res.redirect("back");
              } else {
                var arr = percentage(filteredUsers, req);
                res.render("home", {
                  user: shuffle(arr),
                });
              }
            }
          );
        }
        // if user has selected doesn't Matter
        if (foundUser.relType === "Doesn't Matter") {
          User.find(
            {
              _id: {
                $ne: req.user,
              },
              gender: "Others",
              age: {
                $gte: foundUser.relInitialAge - 2,
                $lte: foundUser.relFinalAge + 2,
              },
            },
            function (err, filteredUsers) {
              if (err) {
                console.log(err);
                return res.redirect("back");
              } else {
                var arr = percentage(filteredUsers, req);
                res.render("home", {
                  user: shuffle(arr),
                });
              }
            }
          );
        }
      }
    }
  });
});

function percentage(filteredUsers, req) {
  var score = 0;
  var array = [];
  // var percentage = [];
  filteredUsers.forEach((filteredusers) => {
    if (filteredusers.sexuality === req.user.sexuality) {
      score += 15;
    }

    if (filteredusers.relType === req.user.relType) {
      score += 15;
    }

    if (filteredusers.gender === req.user.gender) {
      score += 10;
    }

    if (filteredusers.maritalStatus === req.user.maritalStatus) {
      score += 7;
    }

    if (filteredusers.liveIn === req.user.liveIn) {
      score += 5;
    }

    if (filteredusers.smoke === req.user.smoke) {
      score += 3;
    }

    if (filteredusers.alcohol === req.user.alcohol) {
      score += 3;
    }
    var percentage = Math.round((score / 60) * 100);
    var x = {
      user: filteredusers,
      percentage: percentage,
    };
    array.push(x);
    score = 0;
    // filteredusers.temp.push(Math.round((score / 44) * 100));
    // console.log( percentage );
  });
  return array;
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

module.exports = router;
