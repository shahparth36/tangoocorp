require("dotenv/config");
var express = require("express");
var router = express.Router();
var User = require("../models/user");
(async = require("async")),
  (nodemailer = require("nodemailer")),
  (crypto = require("crypto")),
  (multer = require("multer"));
var cities = require("all-countries-and-cities-json");
var indianCities = cities["India"];
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

router.get("/settings/:loggedInUser_id", (req, res) => {
  User.findById(req.params.loggedInUser_id, (err, foundUser) => {
    if (err) {
      console.log(err);
      return res.redirect("back");
    }
    res.render("settings", {
      user: foundUser,
      indianCities: indianCities,
    });
  });
});

router.post("/edit/:id", middleware.isLoggedIn, (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    {
      username: req.body.username,
      email: req.body.email,
      phNumber: req.body.phNumber,
    },
    async (err, updatedUser) => {
      if (err) {
        if (
          err.message ===
          `E11000 duplicate key error collection: dating_app.users index: username_1 dup key: { username: "${req.body.username}" }`
        ) {
          req.flash("error", "Username already exists.Please try again.");
          return res.redirect(`/settings/${req.params.id}`);
        }

        if (
          err.message ===
          `E11000 duplicate key error collection: dating_app.users index: email_1 dup key: { email: "${req.body.email}" }`
        ) {
          req.flash("error", "Email already exists.Please try again.");
          return res.redirect(`/settings/${req.params.id}`);
        }

        if (
          err.message ===
          `E11000 duplicate key error collection: dating_app.users index: phNumber_1 dup key: { phNumber: "${req.body.phNumber}" }`
        ) {
          req.flash("error", "Contact No already exists.Please try again.");
          return res.redirect(`/settings/${req.params.id}`);
        }
      } else {
        await req.flash(
          "success",
          "Details updated Successfully! Please Log in to continue."
        );
        res.redirect("/login");
      }
    }
  );
});

router.post("/changePassword/:id", middleware.isLoggedIn, (req, res) => {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
      req.flash("error", err);
      res.redirect("back");
    } else {
      if (req.body.password === req.body.confirm) {
        req.user.setPassword(req.body.password, function (err) {
          req.user.save(function (err) {
            req.flash(
              "success",
              "Your password has been changed successfully.Please login to continue."
            );
            res.redirect("/login");
          });
        });
      } else {
        req.flash("error", "Passwords do not match.");
        return res.redirect("back");
      }
    }
  });
});

router.put(
  "/edit/:id/image",
  middleware.isLoggedIn,
  upload.single("image"),
  function (req, res) {
    User.findById(req.params.id, async function (err, foundUser) {
      if (err) {
        req.flash("error", "Something went wrong");
        res.redirect("back");
      } else {
        if (req.file) {
          try {
            await cloudinary.v2.uploader.destroy(foundUser.imageId);
            var result = await cloudinary.v2.uploader.upload(req.file.path);
            foundUser.imageId = result.public_id;
            foundUser.image = result.secure_url;
          } catch (err) {
            req.flash("error", "Something went wrong");
            return res.redirect("back");
          }
        }
        foundUser.save();
        req.flash("success", "Successfully Updated!");
        res.redirect("/settings/" + req.params.id);
      }
    });
  }
);

router.post("/delete/:id", middleware.isLoggedIn, function (req, res) {
  User.findByIdAndRemove(req.params.id, async function (err, user) {
    if (err) {
      console.log(err);
      req.flash("error", "Something went wrong, please try again");
      return res.redirect("back");
    } else {
      for (var image of user.images) {
        await cloudinary.v2.uploader.destroy(image.public_id);
      }
      await cloudinary.v2.uploader.destroy(user.imageId);
      await user.remove();

      req.flash("success", "Your Account was Deleted");
      res.redirect("/login");
    }
  });
});

module.exports = router;
