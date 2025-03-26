const Review = require('../models/review');
const Campground = require('../models/campground');
const ExpressError = require('../utils/ExpressError')
const {campSchema} = require('../schemas');

const isLoggedIn = async(req, res, next)=>{
    if(!req.isAuthenticated()){
        // console.log(req.path, req.originalUrl);
        req.session.returnTo = req.originalUrl
        req.flash('error', 'you must be signed in..');
        return res.redirect('/login');
    }
    next();
}

const storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

const isAuthor = async(req,res,next)=>{
    const id = req.params.id;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'you do not have permission to do that!!');
        res.redirect(`/campgrounds/${id}`);
    }
    next();
}

const validateCampground = (req,res,next)=>{
    const {error} = campSchema.validate(req.body);
    if(error){
      const msg = error.details.map((el)=> el.message).join(',');
      throw new ExpressError(msg, 400);
    }
    else{
     next();
    } 
};

const isReviewAuthor = async(req,res,next)=>{
    const {id, reviewId} = req.params.reviewId;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'you do not have permission to do that!!');
        res.redirect(`/campgrounds/${id}`);
    }
    next();
}


// module.exports = {isLoggedIn}

module.exports = {isLoggedIn, storeReturnTo, isAuthor, validateCampground, isReviewAuthor}