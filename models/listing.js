const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const Host = require("./host.js");
const { required } = require("joi");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
     url: String,
     filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: "Review",
  },
  ],
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry:{
    type:{
      type:String,
      enum:['Point'],
      required: true
    },
    coordinates:{
      type:[Number],
      required:true
    }
  },
  host: { type: Schema.Types.ObjectId, ref: "Host" },
  category:{
    type:String,
    enum:["Rooms","Mountains","Castles","Beaches","Awesome Pools","Camping","Arctic"]
  },
    isActive: {
        type: Boolean,
        default: false
    }
});

listingSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;

  await Review.deleteMany({ _id: { $in: doc.reviews } });
  console.log(`Deleted reviews for listing ${doc._id}`);

  if (doc.host) {
    await Host.findByIdAndUpdate(doc.host, { $pull: { listings: doc._id } });

    const host = await Host.findById(doc.host);
    if (host && host.listings.length === 0) {
      await Host.findByIdAndDelete(doc.host);
      console.log(`Deleted host ${host._id} because they have no more listings`);
    }
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
