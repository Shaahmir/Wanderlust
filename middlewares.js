const Listing = require("./models/listing.js");
const {reviewSchema,listingSchema} = require("./schema.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utility/ExpressError.js")

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectURL = req.originalUrl;
        req.flash("error","You must be Logged in");
        return res.redirect("/login");
      }
      next();
}

module.exports.saveRedirectURL = (req,res,next)=>{
    if(req.session.redirectURL){
    res.locals.redirectURL = req.session.redirectURL;
    }
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    let { id } = req.params;
    let listing =await  Listing.findById(id);
    if(!res.locals.currUser || !listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not the Owner");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
  let {id,reviewId} = req.params;
  const review = await Review.findById(reviewId);
  console.log(review);
  console.log(review.author._id,".....",res.locals.currUser._id)
  if(!review.author._id.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of review");
    return res.redirect(`/listings/${id}`)
  }
  next();
}