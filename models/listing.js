const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
     type: String,
    default:
      "https://aspiringlaw.co.nz/sites/default/files/styles/ratio_3_x_1_large/public/2020-11/Residential%20property%20default.jpg?itok=mno6Ztze",
    set: (v) =>
      v === ""
        ? "https://aspiringlaw.co.nz/sites/default/files/styles/ratio_3_x_1_large/public/2020-11/Residential%20property%20default.jpg?itok=mno6Ztze"
        : v,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  },
  ],
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    console.log(`Deleted reviews for listing ${listing._id}`);
  }
});


const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
