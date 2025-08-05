const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
