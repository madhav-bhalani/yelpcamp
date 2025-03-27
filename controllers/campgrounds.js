const Campground = require('../models/campground');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const { ObjectId } = require('mongoose').Types;

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds});
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
}

module.exports.createCampground = async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);
   
    const camp = new Campground(req.body.campground);
    camp.images =  req.files.map(f => ({url: f.path, fileName: f.filename}));
    camp.author = req.user._id;
    await camp.save();
    console.log(camp);
    // console.log("new record added!!");
    req.flash('success', 'added a new campground!!');
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.viewCampground = async (req, res) => {
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
    
}

module.exports.renderEditForm = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.find({ _id: id });
  if(!campground){
    req.flash('error', 'No such campground found!!');
    return res.redirect('/campgrounds');
  }
  res.render("campgrounds/edit", { campground });
}

module.exports.deleteCampground = async (req, res) => {
  const id = req.params.id;
  await Campground.findByIdAndDelete(id);
  req.flash('success', 'campground deleted successfully!!');
  res.redirect("/campgrounds");
}

module.exports.updateCampground = async (req, res) => {
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
}