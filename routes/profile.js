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

router.get("/profile/:id", middleware.isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      console.log(err);
    } else {
      res.render("viewProfile", {
        user: foundUser,
      });
    }
  });
});

// Edit Profile

router.get("/profile/:id/edit", middleware.isLoggedIn, function (req, res) {
  User.findById(req.params.id, function (err, foundUser) {
    if (err) {
      req.flash("error", "Something went wrong.");
      return res.redirect("back");
    }
    res.render("editProfile", { user: foundUser, indianCities: indianCities });
  });
});

router.put("/profile/:id/update", middleware.isLoggedIn, function (req, res) {
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
    res.redirect("/profile/" + req.params.id + "/edit");
  } else {
    User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.user.firstName,
        lastName: req.body.user.lastName,
        fullName: req.body.user.firstName + " " + req.body.user.lastName,
        city: req.body.user.city,
        gender: req.body.user.gender,
        dob: req.body.user.dob,
        age: age,
        bio: req.body.user.bio,
        maritalStatus: req.body.user.maritalStatus,
        sexuality: req.body.user.sexuality,
        relType: req.body.user.relType,
        liveIn: req.body.user.liveIn,
        smoke: req.body.user.smoke,
        alcohol: req.body.user.alcohol,
        relInitialAge: req.body.user.relInitialAge,
        relFinalAge: req.body.user.relFinalAge,
        insta_url: req.body.user.insta_url,
        facebook_url: req.body.user.facebook_url,
        twitter_url: req.body.user.twitter_url,
      },
      function (err, updatedUser) {
        if (err) {
          req.flash("error", "Something went wrong.");
          return res.redirect("back");
        } else {
          req.flash("success", "Your details have been updated successfully.");
          res.redirect("/profile/" + req.params.id + "/edit");
        }
      }
    );
  }
});

router.put(
  "/profile/:id/view",
  upload.array("images"),
  async function (req, res) {
    User.findById(req.params.id, async function (err, user) {
      //check if there is any image for deletion
      if (req.body.deleteImages && req.body.deleteImages.length) {
        //assign deleteImages from req.body to its own variable
        var deleteImages = req.body.deleteImages;
        //loop over for deletion of selected images
        for (var public_id of deleteImages) {
          await cloudinary.v2.uploader.destroy(public_id);
          for (var image of user.images) {
            if (image.public_id === public_id) {
              var index = user.images.indexOf(image);
              user.images.splice(index, 1);
            }
          }
        }
      }
      //check if there are any new images to upload
      if (req.files) {
        for (const file of req.files) {
          var image = await cloudinary.v2.uploader.upload(file.path);
          user.images.push({
            url: image.secure_url,
            public_id: image.public_id,
          });
        }
      }
      //save the new images in database
      user.save();
      res.redirect("/profile/" + req.params.id + "/edit");
    });
  }
);

router.put(
  "/profile/:id/view1",
  upload.array("images"),
  async function (req, res) {
    User.findById(req.params.id, async function (err, user) {
      //check if there is any image for deletion
      if (req.body.deleteImages && req.body.deleteImages.length) {
        //assign deleteImages from req.body to its own variable
        var deleteImages = req.body.deleteImages;
        //loop over for deletion of selected images
        for (var public_id of deleteImages) {
          await cloudinary.v2.uploader.destroy(public_id);
          for (var image of user.images) {
            if (image.public_id === public_id) {
              var index = user.images.indexOf(image);
              user.images.splice(index, 1);
            }
          }
        }
      }
      //check if there are any new images to upload
      if (req.files) {
        for (const file of req.files) {
          var image = await cloudinary.v2.uploader.upload(file.path);
          user.images.push({
            url: image.secure_url,
            public_id: image.public_id,
          });
        }
      }
      //save the new images in database
      user.save();
      res.redirect("/settings/" + req.params.id);
    });
  }
);

module.exports = router;
