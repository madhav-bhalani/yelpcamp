const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require("../models/campground");
const Review = require('../models/review');
const {isLoggedIn, isReviewAuthor} =  require('../middlewares/auth');


 //reviews
 router.post('/:id/reviews', isLoggedIn, catchAsync(async(req,res)=>{
    const id = req.params.id
    const body = req.body.review.body;
    const rating = req.body.review.rating;
    const campground = await Campground.findById(id);
    const review = await Review.insertOne({body: body, rating: rating, camp: id})
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'added a new review!!');
    res.redirect(`/campgrounds/${id}`);
}));

  //delete review
  router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor,async(req,res)=>{
    try{
      const {reviewId, id} = req.params;
      await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
      await Review.findByIdAndDelete(reviewId);
      req.flash('success', 'review deleted!!');
      res.redirect(`/campgrounds/${id}`); 
    }
    catch(err){

    }
  })
  
  module.exports = router;  