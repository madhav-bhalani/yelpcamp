const express = require("express");
const app = express();
const port = 3050;
const path = require("path");
const ejsMate = require("ejs-mate");
const Campground = require("./models/campground");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

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

app.post("/campgrounds", async (req, res) => {
  try {
    const camp = new Campground(req.body);
    await camp.save();
    console.log("new record added!!");
    res.redirect(`/campgrounds/${camp._id}`);
  } catch (err) {
    console.log("Error while adding new campground: ");
    console.log(err);
  }
});

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

app.put("/campgrounds/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const newTitle = req.body.title;
    const newLoc = req.body.location;
    const newDesc = req.body.description;
    const newImage = req.body.image;
    const newPrice = req.body.price;
    const campground = await Campground.findByIdAndUpdate(id, {
      title: newTitle,
      location: newLoc,
      description: newDesc,
      price: newPrice,
      image: newImage,
    });
    res.redirect(`/campgrounds/${id}`);
  } catch (err) {
    console.log("Error encountered: ");
    console.log(err);
  }
});

app.get("/campgrounds/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const camp = await Campground.find({ _id: id });
    res.render("campgrounds/show", { camp });
    // console.log(camp);
  } catch {
    console.log("Error while searching: ");
    console.log(err);
  }
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  try {
    const camp = await Campground.find({ _id: req.params.id });
    res.render("campgrounds/edit", { camp });
  } catch (err) {
    console.log("Error encountered: ");
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
