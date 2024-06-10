"use strict";

const express = require("express");
const ejs = require("ejs");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const errorHandler = require("errorhandler");
const session = require("express-session");
const passport = require("passport");
const routes = require("./routes");

const app = express();
app.engine("ejs", ejs.__express);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(cookieParser());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(errorHandler());
app.use(
  session({ secret: "keyboard cat", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // 允许所有源访问，生产环境中应更具体
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

require("./auth");

app.get("/", routes.site.index);
app.get(
  "/login",
  (req, res, next) => {
    console.log("req.query----", req.query);
    console.log("req.query----", req.session);
    next()
  },
  routes.site.loginForm
);
app.post("/login", (req, res, next) => {
  console.log("req.session.returnTo---", req.session.returnTo);
  return passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
  })(req, res, next);
});
app.get("/logout", routes.site.logout);
app.get("/account", routes.site.account);

app.get("/dialog/authorize", routes.oauth2.authorization);
app.post("/dialog/authorize/decision", routes.oauth2.decision);
app.post("/oauth/token", routes.oauth2.token);

app.get("/api/userinfo", routes.user.info);
app.get("/api/clientinfo", routes.client.info);

app.listen(process.env.PORT || 3000);

module.exports = app;
