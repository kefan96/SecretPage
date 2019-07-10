const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const localStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose");
const User = require("./models/user");

mongoose.connect("mongodb+srv://Admin:5t6y7u8iYKF!@cluster0-mhbxn.mongodb.net/test?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log("Connected to DB!");
}).catch(err => {
  console.log("ERROR: ", err.message);
});

app.use(require("express-session")({
    secret: "Jake is the best and cutest dog in the world",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({extended: true}));
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/secret", isLoggedIn, (req, res) => {
    res.render("secret");
});

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
      if (err) {
        console.log(err);
        return res.render("register");
      } else {
        passport.authenticate("local")(req, res, () => {
          res.redirect("/secret");
        });
      }
    });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate("local", {
  successRedirect: "/secret",
  failureRedirect: "/login"
}), (req, res) => {
  
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

app.listen(3000, () => {
    console.log("server liten on port 3000")
});
