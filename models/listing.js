const mongoose = require("mongoose");
const Review = require("./reviews");
const { ref } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    url:{
      type:String,
      default:
        "https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg",
    },
    filename:String
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref:"User"
  },

  mapPoint: {
    type: {
      type: String,
      enum: ['Point']
    },
    
    coordinates: {
      type: [Number]
    }
  },

  category:{
    type : String
  },
});

listingSchema.post("findOneAndDelete",async(Listing)=>{
  if(Listing){
    await Review.deleteMany({_id:{$in:Listing.reviews}})
  }
})

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;