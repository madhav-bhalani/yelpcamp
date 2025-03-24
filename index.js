const express = require("express");
const app = express();
const port = 3050;
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ExpressError = require('./utils/ExpressError');
const {campSchema} = require('./schemas');

const campgroundRoutes = require('./routes/campgrounds');



mongoose
  .connect("mongodb://127.0.0.1:27017/yelpcamp")
  .then(() => {
    console.log("Connection Open...");
  })
  .catch((err) => {
    console.log("Ohhhh noooo errorrrr");
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");





app.use('/campgrounds', campgroundRoutes);


// app.get("/", (req, res) => {
//   try {
//     res.render("home");
//   } catch (err) {
//     console.log("Error encountered: ");
//     console.log(err);
//   }
// });



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
