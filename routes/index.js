require("dotenv/config");

var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user"),
  async = require("async"),
  nodemailer = require("nodemailer"),
  crypto = require("crypto"),
  multer = require("multer"),
  cities = require("all-countries-and-cities-json"),
  indianCities = cities["India"],
  fast2sms = require("fast-two-sms");
var middleware = require("../middleware");

//CLOUDINARY REQUIREMENTS
var storage = multer.diskStorage({
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
var imageFilter = function (req, file, cb) {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require("cloudinary");
const { update } = require("../models/user");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

router.get("/createProfile", (req, res) => {
  res.render("createProfile");
});

router.get("/register", function (req, res) {
  res.render("register");
});

router.post("/register", upload.single("image"), function (req, res) {
  User.find({}, (err, allUsers) => {
    if (err) {
      req.flash("error", err);
      return res.redirect("back");
    }
    for (var i = 0; i < allUsers.length; i++) {
      console.log(req.body.user.phNumber);
      console.log(allUsers[i].phNumber);
      if (allUsers[i].phNumber === req.body.user.phNumber) {
        req.flash(
          "error",
          "Phone Number already exists.Please sign up with different Phone Number."
        );
        return res.redirect("/register");
      }

      if (allUsers[i].email === req.body.user.email) {
        req.flash(
          "error",
          "Email Address already exists.Please sign up with different Email Address."
        );
        return res.redirect("/register");
      }

      if (allUsers[i].username === req.body.user.username) {
        console.log("inside last if");
        req.flash(
          "error",
          "Username already exists.Please sign up with different Username."
        );
        return res.redirect("/register");
      }
    }
    if (req.body.password !== req.body.retypedpassword) {
      req.flash("error", "passwords do not match");
      return res.redirect("back");
    } else {
      // console.log("before cloudinary");
      cloudinary.v2.uploader.upload(req.file.path, function (err, result) {
        // console.log("inside cloudinary");
        if (err) {
          console.log(err);
          return res.redirect("/register");
        } else {
          var dateString = req.body.user.dob;
          var today = new Date();
          var birthDate = new Date(dateString);
          var age = today.getFullYear() - birthDate.getFullYear();
          var m = today.getMonth() - birthDate.getMonth();
          var da = today.getDate() - birthDate.getDate();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          if (m < 0) {
            m += 12;
          }
          if (da < 0) {
            da += 30;
          }
          if (age < 15 || age > 76) {
            req.flash(
              "error",
              "Age " + age + " is restricted. You must be 16 years or older."
            );
            res.redirect("/register");
          } else {
            var otp = Math.floor(10000 + Math.random() * 90000);
            var unirest = require("unirest");

            var req1 = unirest("POST", "https://www.fast2sms.com/dev/bulk");

            req1.headers({
              "content-type": "application/x-www-form-urlencoded",
              "cache-control": "no-cache",
              authorization: process.env.FAST_TWO_SMS,
            });
            req1.form({
              sender_id: "FSTSMS",
              language: "english",
              route: "qt",
              numbers: req.body.user.phNumber,
              message: "33529",
              variables: "{#AA#}",
              variables_values: otp,
            });

            req1.end(function (res) {
              if (res.error) throw new Error(res.error);
              console.log(res.body);
            });

            console.log("message sent succesfully with otp " + otp);
            res.render("otp", {
              username: req.body.user.username,
              email: req.body.user.email,
              firstName: req.body.user.firstName,
              lastName: req.body.user.lastName,
              phNumber: req.body.user.phNumber,
              image: result.secure_url,
              imageId: result.public_id,
              password: req.body.password,
              retypedpassword: req.body.retypedpassword,
              dob: req.body.user.dob,
              indianCities: indianCities,
              age: age,
              otp: otp,
              result: result,
            });
          }
        }
      });
    }
  });
});

router.post("/resendotp", function (req, res) {
  if (req.body.password !== req.body.retypedpassword) {
    req.flash("error", "passwords do not match");
    return res.redirect("back");
  } else {
    var dateString = req.body.user.dob;
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    var da = today.getDate() - birthDate.getDate();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (m < 0) {
      m += 12;
    }
    if (da < 0) {
      da += 30;
    }
    if (age < 15 || age > 76) {
      req.flash(
        "error",
        "Age " + age + " is restricted. You must be 16 years or older."
      );
      res.redirect("/register");
    } else {
      var otp = Math.floor(10000 + Math.random() * 90000);
      var unirest = require("unirest");

      var req1 = unirest("POST", "https://www.fast2sms.com/dev/bulk");

      req1.headers({
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        authorization: process.env.FAST_TWO_SMS,
      });
      req1.form({
        sender_id: "FSTSMS",
        language: "english",
        route: "qt",
        numbers: req.body.user.phNumber,
        message: "33529",
        variables: "{#AA#}",
        variables_values: otp,
      });

      req1.end(function (res) {
        if (res.error) throw new Error(res.error);
        console.log(res.body);
      });

      console.log("message sent succesfully with otp " + otp);
      res.render("otp", {
        username: req.body.user.username,
        email: req.body.user.email,
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        phNumber: req.body.user.phNumber,
        image: req.body.result1,
        imageId: req.body.result2,
        password: req.body.password,
        retypedpassword: req.body.retypedpassword,
        dob: req.body.user.dob,
        indianCities: indianCities,
        age: age,
        otp: otp,
        result: req.body.result,
      });
    }
  }
});

router.get("/otp", function (req, res) {
  res.render("otp");
});

router.post("/otp", function (req, res) {
  console.log(req.body.enteredOTP);
  console.log(req.body.otp);
  enteredOTP = req.body.enteredOTP;
  if (enteredOTP === req.body.otp) {
    res.render("createProfile", {
      username: req.body.user.username,
      email: req.body.user.email,
      firstName: req.body.user.firstName,
      lastName: req.body.user.lastName,
      phNumber: req.body.user.phNumber,
      image: req.body.result1,
      imageId: req.body.result2,
      password: req.body.password,
      dob: req.body.user.dob,
      indianCities: indianCities,
      age: req.body.user.age,
    });
  } else {
    req.flash("error", "You Entered the wrong OTP. Please try again.");
    res.redirect("/register");
  }
});

router.post("/profile", upload.array("images"), async function (req, res) {
  req.body.user.images = [];
  for (const file of req.files) {
    var image = await cloudinary.v2.uploader.upload(file.path);
    req.body.user.images.push({
      url: image.secure_url,
      public_id: image.public_id,
    });
  }
  var newUser = new User({
    username: req.body.user.username,
    email: req.body.user.email,
    firstName: req.body.user.firstName,
    lastName: req.body.user.lastName,
    fullName: req.body.user.firstName + " " + req.body.user.lastName,
    phNumber: req.body.user.phNumber,
    image: req.body.image,
    imageId: req.body.imageId,
    dob: req.body.user.dob,
    city: req.body.user.city,
    gender: req.body.user.gender,
    maritalStatus: req.body.user.maritalStatus,
    relType: req.body.user.relType,
    liveIn: req.body.user.liveIn,
    smoke: req.body.user.smoke,
    alcohol: req.body.user.alcohol,
    sexuality: req.body.user.sexuality,
    bio: req.body.user.bio,
    age: req.body.user.age,
    relInitialAge: req.body.user.relInitialAge,
    relFinalAge: req.body.user.relFinalAge,
    images: req.body.user.images,
    insta_url: req.body.user.insta_url,
    facebook_url: req.body.user.facebook_url,
    twitter_url: req.body.user.twitter_url,
  });

  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      req.flash("error", err.message);
      console.log(err);
      return res.redirect("back");
    } else {
      if (req.body.user.relIntAge >= req.body.user.relFinalAge) {
        req.flash("error", "final age cannot be less than initial age");
        return res.redirect("back");
      } else {
        req.flash(
          "success",
          "Successfully Registered, Please Login to continue"
        );
        res.redirect("/login");
      }
    }
  });
});

router.get("/login", function (req, res) {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  function (req, res) {
    req.flash("success", `Welcome Back, ${req.user.username}!`);
    res.redirect(`/home/${req.user._id}`);
  }
);

router.get("/logout", function (req, res) {
  req.logOut();
  req.flash("success", "Logged you out");
  res.redirect("/login");
});

// forgot password
router.get("/forgot", function (req, res) {
  res.render("forgot");
});

router.post("/forgot", function (req, res, next) {
  async.waterfall(
    [
      function (done) {
        crypto.randomBytes(20, function (err, buf) {
          var token = buf.toString("hex");
          done(err, token);
        });
      },
      function (token, done) {
        User.findOne({ email: req.body.email }, function (err, user) {
          if (!user) {
            console.log("hi");
            req.flash("error", "No account with that email address exists.");
            return res.redirect("back");
          }
          console.log(user);
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

          user.save(function (err) {
            done(err, token, user);
          });
        });
      },
      function (token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.email,
            pass: process.env.password,
          },
        });
        var mailOptions = {
          to: user.email,
          from: process.env.email,
          subject: "Node.js Password Reset",
          text:
            "You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process:\n\n" +
            "http://" +
            req.headers.host +
            "/reset/" +
            token +
            "\n\n" +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          console.log("mail sent");
          req.flash(
            "success",
            "An e-mail has been sent to " +
              user.email +
              " with further instructions."
          );
          done(err, "done");
        });
      },
    ],
    function (err) {
      if (err) return next(err);
      res.redirect("/login");
    }
  );
});

router.get("/reset/:token", function (req, res) {
  User.findOne(
    {
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    },
    function (err, user) {
      if (!user) {
        req.flash("error", "Password reset token is invalid or has expired.");
        return res.redirect("/forgot");
      }
      res.render("reset", { token: req.params.token });
    }
  );
});

router.post("/reset/:token", function (req, res) {
  async.waterfall(
    [
      function (done) {
        User.findOne(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          function (err, user) {
            if (!user) {
              req.flash(
                "error",
                "Password reset token is invalid or has expired."
              );
              return res.redirect("back");
            }
            if (req.body.password === req.body.confirm) {
              user.setPassword(req.body.password, function (err) {
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save(function (err) {
                  req.logIn(user, function (err) {
                    done(err, user);
                  });
                });
              });
            } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect("back");
            }
          }
        );
      },
      function (user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: "Gmail",
          auth: {
            user: process.env.email,
            pass: process.env.password,
          },
        });
        var mailOptions = {
          to: user.email,
          from: process.env.email,
          subject: "Your password has been changed",
          text:
            "Hello,\n\n" +
            "This is a confirmation that the password for your account " +
            user.email +
            " has just been changed.\n",
        };
        smtpTransport.sendMail(mailOptions, function (err) {
          req.flash("success", "Success! Your password has been changed.");
          done(err);
        });
      },
    ],
    function (err) {
      res.redirect("/");
    }
  );
});

module.exports = router;
