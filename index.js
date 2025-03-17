const express = require("express");
const app = express();
const port = 3050;
const Joi = require('joi');
const path = require("path");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const campground = require("./models/campground");
const { ObjectId } = require('mongoose').Types;

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

mongoose
  .connect("mongodb://127.0.0.1:27017/yelpcamp")
  .then(() => {
    console.log("Connection Open...");
  })
  .catch((err) => {
    console.log("Ohhhh noooo errorrrr");
    console.log(err);
  });

const validateCampground = (req,res,next)=>{
  const campSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
    }).required()
   
  });
  const {error} = campSchema.validate(req.body);
  if(error){
    const msg = error.details.map((el)=> el.message).join(',');
    throw new ExpressError(msg, 400);
  }
  else{
   next();
  }
};

app.get("/", (req, res) => {
  try {
    res.render("home");
  } catch (err) {
    console.log("Error encountered: ");
    console.log(err);
  }
});

app.get("/createCampground", async (req, res) => {
  try {
    const camp = new Campground({
      title: "My Backyard",
      description: "cheap camping",
      price: 12.44,
    });
    await camp.save();
    res.send(camp);
  } catch (err) {
    console.log("Error encountered: ");
    console.log(err);
  }
});

app.get("/campgrounds", async (req, res) => {
  try {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  } catch (err) {
    console.log("Error while fething campgrounds: ");
    console.log(err);
  }
});

//adding new campground
app.post("/campgrounds", validateCampground, catchAsync(async (req, res, next) => {
    // if(!req.body.campground) throw new ExpressError('Invalid campground data', 400);
    const camp = new Campground(req.body.campground);
    await camp.save();
    console.log("new record added!!");
    res.redirect(`/campgrounds/${camp._id}`);
}));

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.delete("/campgrounds/:id", async (req, res) => {
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
app.put("/campgrounds/:id", catchAsync(async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
      throw new ExpressError('Invalid campground ID', 400);
  }

  if (!req.body) {
      throw new ExpressError('Invalid campground data', 400);
  }

  const campground = await Campground.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true
  });

  if (!campground) {
      throw new ExpressError('Campground not found', 404);
  }

  res.redirect(`/campgrounds/${id}`);
}));



app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      throw new ExpressError('Invalid campground ID', 400);
    }
    const camp = await Campground.find({ _id: id });
    res.render("campgrounds/show", { camp });

}));

app.get("/campgrounds/:id/edit", async (req, res) => {
  try {
    const camp = await Campground.find({ _id: req.params.id });
    res.render("campgrounds/edit", { camp });
  } catch (err) {
    console.log("Error encountered: ");
    console.log(err);
  }
});

app.all(/(.*)/, (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next)=>{
  const {status = 500, message = 'Something went wrong!!'} = err;
  res.status(status).render('error', {err});
  // res.send('Opps!! something went wrong');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
