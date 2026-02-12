const User = require("../models/user");

//Signup - Form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

//Signup - User
module.exports.sigupUser = async (req, res, next) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({
      username,
      email,
    });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) {
        return next();
      }
      req.flash("success", "Welcome to WanderLust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//Login - Form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

//Login - User
module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back to WanderLust");
  let redirectURL = res.locals.redirectURL || "/listings";
  res.redirect(redirectURL);
};

//Logout - User
module.exports.logoutUser = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged you out!");
    res.redirect("/listings");
  });
};
