const Listing = require("../models/listing.js");

//Index Route
module.exports.index = async (req, res) => {
  const allData = await Listing.find();

  res.render("listings/index.ejs", { allData });
};

//New Route
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

//Show Route
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${listing.location}&limit=1&appid=${process.env.GEOCODING_API_KEY }`;
    console.log(apiUrl);
    let response = await fetch(apiUrl)
    let reqData = await  response.json();

    const longitude = reqData[0].lon;
    const latitude = reqData[0].lat;

    listing.mapPoint = {
        type: 'Point',
        coordinates: [longitude, latitude]
    };
    console.log(listing)
  if (!listing) {
    req.flash("error", "Listting does not Exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

//Create Route
module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  let newListing = Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${newListing.location}&limit=1&appid=${process.env.GEOCODING_API_KEY }`;
  let response = await fetch(apiUrl)
  let reqData = await  response.json();

  const longitude = reqData[0].lon;
  const latitude = reqData[0].lat;

  newListing.mapPoint = {
      type: 'Point',
      coordinates: [longitude, latitude]
  };
 await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

//Edit Route
module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listting does not Exist");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

//Update Route
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if(req.file){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
  }
  req.flash("success", "Listing Edited!");
  res.redirect(`/listings/${id}`);
};

//Destroy Route
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndDelete(id);
  console.log(listing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};


//Filter Route
module.exports.filterListing = async(req,res)=>{

  const allData = await Listing.find();
  const name  = req.query.type;
  console.log(req.query);
 res.render("listings/filtering",{name,allData});
}

//Search Route
module.exports.searchListing = async(req,res)=>{
  let query = req.query.q;
  const result =  await Listing.find({ title: { $regex: query, $options: 'i' } });
  console.log(result)
  res.render("listings/search",{result})
}