const Campground = require("../models/campground");
const Review = require('../models/review');

module.exports.createReview = async(req,res)=>{
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
}

module.exports.deleteReview = async(req,res)=>{
    const {reviewId, id} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'review deleted!!');
    res.redirect(`/campgrounds/${id}`); 
}