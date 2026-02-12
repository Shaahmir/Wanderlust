const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utility/wrapAsync");
const passport = require("passport");
const { saveRedirectURL } = require("../middlewares");
const router = express.Router();
const userController = require("../Controllers/users.js");

//Signup - User &&  Signup - User
router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.sigupUser));

//Login - User &&  Login - User  
router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectURL,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser
  );

//Logout - User
router.get("/logout", userController.logoutUser);

module.exports = router;
