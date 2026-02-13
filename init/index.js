const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const MONGO_URL = process.env.ATLASDB_URL;


main()
  .then(() => console.log("Connection Successful"))
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDb = async () => {
  await Listing.deleteMany({});

  // Update each listing with owner ID
  initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "698f110530172c36700a9d66",
  }));

  for (const el of initData.data) {
    try {
      const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${el.location}&limit=1&appid=${process.env.GEOCODING_API_KEY}`;

      console.log(process.env.GEOCODING_API_KEY)
      console.log(apiUrl);

      let response = await fetch(apiUrl);
      let reqData = await response.json();

      console.log("API Response for:", el.location, reqData);

      if (reqData.length > 0) {
        const longitude = reqData[0].lon;
        const latitude = reqData[0].lat;


        console.log(`Coordinates for ${el.location}:`, longitude, latitude);

        el.mapPoint = {
          type: "Point",
          coordinates: [longitude, latitude], // GeoJSON format
        };
      } else {
        console.log(`No coordinates found for: ${el.location}`);
      }
    } catch (error) {
      console.log(`Error fetching location for ${el.location}:`, error);
    }
  }

  // Insert updated listings into MongoDB
  try {
    await Listing.insertMany(initData.data);
    console.log("Data saved successfully");
  } catch (e) {
    console.error("Error saving data:", e);
  }
};

initDb();
