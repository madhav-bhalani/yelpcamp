const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const Campground = require("../models/campground");
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { ObjectId } = require('mongoose').Types;


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


// router.get("/createCampground", async (req, res) => {
//     try {
//       const camp = new Campground({
//         title: "My Backyard",
//         description: "cheap camping",
//         price: 12.44,
//       });
//       await camp.save();
//       res.send(camp);
//     } catch (err) {
//       console.log("Error encountered: ");
//       console.log(err);
//     }
//   });
  
//display all campgrounds    
  router.get("/", async (req, res) => {
    try {
      const campgrounds = await Campground.find({});
     
      res.render("campgrounds/index", { campgrounds});
    } catch (err) {
      console.log("Error while fething campgrounds: ");
      console.log(err);
    }
  });

  //render new campground form
  router.get("/new", (req, res) => {
    res.render("campgrounds/new");
  });
  
  //adding new campground
  router.post("/", validateCampground, catchAsync(async (req, res, next) => {
      // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);
      const camp = new Campground(req.body.campground);
      await camp.save();
      console.log("new record added!!");
      res.redirect(`/campgrounds/${camp._id}`);
  }));
  
    //display single campground
    router.get("/:id", catchAsync(async (req, res) => {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          throw new ExpressError('Invalid campground ID', 400);
        }
        const camp = await Campground.find({ _id: id });
        const count = await Review.find({camp: id}).countDocuments();
        res.render("campgrounds/show", { camp, count });
    
    }));

//render campground Edit form
router.get("/:id/edit", async (req, res) => {
    try {
      const camp = await Campground.find({ _id: req.params.id });
      res.render("campgrounds/edit", { camp });
    } catch (err) {
      console.log("Error encountered: ");
      console.log(err);
    }
  });
  
  //delete campground
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await Campground.findByIdAndDelete(id);
      res.redirect("/campgrounds");
    } catch (err) {
      console.log("Error while deleting: ");
      console.log(err);
    }
  });
  
  //update campground
  router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    const id = req.params.id;
  
    if (!ObjectId.isValid(id)) {
        throw new ExpressError('Invalid campground ID', 400);
    }
  
    if (!req.body) {
        throw new ExpressError('Invalid campground data', 400);
    }
  
    const camp = await Campground.findByIdAndUpdate(id, req.body.campground, {
        runValidators: true,
        new: true
    });
  
    if (!camp) {
        throw new ExpressError('Campground not found', 404);
    }
  
    res.redirect(`/campgrounds/${id}`);
  }));
  
  
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
      res.redirect(`/campgrounds/${id}`);
  }));
  
module.exports = router;  
  