const express = require("express");
const router = express.Router();
const wrapAsync = require("../utility/wrapAsync.js");
const { isLoggedin, isOwner, validateListing } = require("../middlewares.js");
const listingController = require("../Controllers/listings.js");
const multer = require("multer");
const { storage } = require("../CloudConfig.js");
const upload = multer({ storage });

//Index Route && Create Route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedin,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//New Route
router.get("/new", isLoggedin, listingController.renderNewForm);

 //Filter Route
router.get("/filter",listingController.filterListing);

 //Search Route
router.get("/search",wrapAsync(listingController.searchListing));

//Show Route && Update Route && Destroy Route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isOwner, wrapAsync(listingController.destroyListing));


//Edit Route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(listingController.editListing)
);



module.exports = router;
