const express = require("express");
const app = express();
const port = 3050;
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');


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
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
  secret: 'madhvoasfJNIUskfnNJsasnKA',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig)) 

app.use(flash());
app.use((req,res,next)=>{
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds', reviewRoutes);



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
