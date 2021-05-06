require("dotenv/config");
var express = require("express"),
  passport = require("passport"),
  app = express(),
  bodyParser = require("body-parser"),
  mongoose = require("mongoose"),
  flash = require("connect-flash"),
  LocalStrategy = require("passport-local"),
  methodOverride = require("method-override"),
  passportLocalMongoose = require("passport-local-mongoose"),
  User = require("./models/user");
(async = require("async")),
  (nodemailer = require("nodemailer")),
  (crypto = require("crypto"));
multer = require("multer");
fast2sms = require("fast-two-sms");

//REQURING ROUTES
var profileRoutes = require("./routes/profile");
var indexRoutes = require("./routes/index");
var landingRoutes = require("./routes/landings");
var exploreRoutes = require("./routes/explore");
var savedProfileRoutes = require("./routes/savedProfile");
var likedProfileRoutes = require("./routes/likedProfile");
var homeRoutes = require("./routes/home");
var settingRoutes = require("./routes/settings");
var footerRoutes = require("./routes/footer");

mongoose.connect(process.env.DATABASEURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(
  require("express-session")({
    secret: "Rusty is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use(profileRoutes);
app.use(indexRoutes);
app.use(landingRoutes);
app.use(exploreRoutes);
app.use(savedProfileRoutes);
app.use(likedProfileRoutes);
app.use(homeRoutes);
app.use(settingRoutes);
app.use(footerRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function () {
  console.log("The Server is listening on " + process.env.PORT);
});
