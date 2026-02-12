if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");
const MONGO_URL = process.env.ATLASDB_URL;
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utility/ExpressError.js");
const listingsRoute = require("./routes/listing.js");
const reviewsRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport =  require("passport");
const LocalStrategy = require("passport-local");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.json());

const sessionOptions = {
  secret: "MySecret",
  resave: false,
  saveUninitialized: true,
  cookie:{
    expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly:true
  }
};

main()
  .then(() => {
    console.log("connection Successful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

//Root
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use("/listings", listingsRoute);
app.use("/listings/:id/reviews", reviewsRoute);
app.use("/",userRoute);

app.listen(port, () => {
  console.log("App is Listening to Port 8080");
});

// app.get("/demoUser",async(req,res)=>{
//   let fakeUser = new User({
//     email:"ahmad@gmail.com",
//     username:"ahmad",
//   })  
//   let registeredUser = await User.register(fakeUser,"helloworld");
//   console.log(registeredUser);
//   res.send(registeredUser);
// })

app.all("*", (req, res, next) => {
  throw new ExpressError(404, "Page Not Found");
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Some error occured" } = err;
  res.status(statusCode).render("error.ejs", { message });
});
