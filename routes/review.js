const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utility/wrapAsync.js");
const {
  validateReview,
  isLoggedin,
  isReviewAuthor,
} = require("../middlewares.js");
const reviewController = require("../Controllers/reviews.js");

//Review - Route
//Add - Review
router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(reviewController.addReview)
);

//Destroy - Review
router.delete(
  "/:reviewId",
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

module.exports = router;
