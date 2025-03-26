const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.Types.ObjectId;
const Review = require('./review')
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
  },
  reviews: [
    {
      type: objectId,
      ref: 'Review'
    }
  ],
  author: {
    type: objectId,
    ref: 'User'
  }
});

CampgroundSchema.post('findOneAndDelete', async(camp)=>{
  if(camp.reviews.length){
    const res = await Review.deleteMany({_id: {$in: camp.reviews}});
    console.log(res);
  }
})

module.exports = mongoose.model("Campground", CampgroundSchema);
