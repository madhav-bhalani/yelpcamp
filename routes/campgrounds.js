const express = require('express');
const router = express.Router();
const Review = require('../models/review');
const User = require('../models/user');
const Campground = require("../models/campground");
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { ObjectId } = require('mongoose').Types;
const {validateCampground} = require('../middlewares/auth');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
// const auth = require ('../middlewares/auth');
// const auth = require('../middlewares/auth');

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
  router.get("/new", isLoggedIn, catchAsync(async(req, res, next) => {
    // if(!req.isAuthenticated()){
    //   req.flash('error', 'You must be signed in..');
    //   return res.redirect('/login');
    // }
    res.render("campgrounds/new");
  }));
  
  //adding new campground
  router.post("/", validateCampground, catchAsync(async (req, res, next) => {
      // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);
      const camp = new Campground(req.body.campground);
      camp.author = req.user._id;
      await camp.save();
      // console.log("new record added!!");
      req.flash('success', 'added a new campground!!');
      res.redirect(`/campgrounds/${camp._id}`);
  }));
  
    //display single campground
    router.get("/:id", catchAsync(async (req, res) => {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          throw new ExpressError('Invalid campground ID', 400);
        }
        const camp = await Campground.findOne({ _id: id }).populate({path: 'reviews', 
          populate: {
            path: 'author'
          }
        }).populate('author');
        // console.log(camp);
        if(!camp){
          req.flash('error', 'No such campground found!!');
          return res.redirect('/campgrounds');
        }
        const count = await Review.find({camp: id}).countDocuments();
        // const reviews = await Review.find({camp: id});
        res.render("campgrounds/show", { camp, count});
    
    }));

//render campground Edit form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    try {
      const id = req.params.id;
      const campground = await Campground.find({ _id: id });
      if(!campground){
        req.flash('error', 'No such campground found!!');
        return res.redirect('/campgrounds');
      }

      res.render("campgrounds/edit", { camp });

      
    } catch (err) {
      console.log("Error encountered: ");
      console.log(err);
    }
  }));
  
  //delete campground
  router.delete("/:id", async (req, res) => {
    try {
      const id = req.params.id;
      await Campground.findByIdAndDelete(id);
      req.flash('success', 'campground deleted successfully!!');
      res.redirect("/campgrounds");
    } catch (err) {
      console.log("Error while deleting: ");
      console.log(err);
    }
  });


  //update campground
  router.put("/:id", isLoggedIn, isAuthor,  validateCampground, catchAsync(async (req, res) => {
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
      req.flash('success', 'campground updated!!');
      res.redirect(`/campgrounds/${id}`);
      if (!camp) {
        throw new ExpressError('Campground not found', 404);
      }
  
    
  }));
  
  
 
  
  
module.exports = router;  
  
