const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require("../models/campground");
const Review = require('../models/review');

 //reviews
 router.post('/:id/reviews', catchAsync(async(req,res)=>{
    const id = req.params.id
    const body = req.body.review.body;
    const rating = req.body.review.rating;
    const campground = await Campground.findById(id);
    const review = await Review.insertOne({body: body, rating: rating, camp: id})
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'added a new review!!');
    res.redirect(`/campgrounds/${id}`);
}));

  //delete review
  router.delete('/:campId/reviews/:id', async(req,res)=>{
    try{
      const {campId, id} = req.params;
      await Campground.findByIdAndUpdate(campId, {$pull: {reviews: id}});
      await Review.findByIdAndDelete(id);
      req.flash('success', 'review deleted!!');
      res.redirect(`/campgrounds/${campId}`); 
    }
    catch(err){

    }
  })
  
  module.exports = router;  