const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hostInfoSchema = new Schema({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  bio: { type: String, required: true },
  favoritePlaces: [{ type: String }],
  hobbies: [{ type: String }],
  location: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,  unique: true},
    image: {
     url: String,
     filename: String,
  },
  listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing", default: [] }]
});

const Host = mongoose.model("Host", hostInfoSchema);
module.exports = Host;