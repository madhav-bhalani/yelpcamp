const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  image: String,
  description: {
    type: String,
    required: true
  },
  price:  {
    type: Number,
    required: true
  },
  location: {
      type: String,
      required: true
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
