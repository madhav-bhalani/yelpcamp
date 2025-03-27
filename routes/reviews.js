const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews')
const {isLoggedIn, isReviewAuthor} =  require('../middlewares/auth');


//reviews
router.post('/:id/reviews', isLoggedIn, catchAsync(reviews.createReview));

//delete review
router.delete('/:id/reviews/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));
  
module.exports = router;  