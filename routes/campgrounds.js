const express = require('express');
const router = express.Router();
const campgrounds  =  require('../controllers/campgrounds');
const catchAsync = require('../utils/catchAsync');
const {validateCampground} = require('../middlewares/auth');
const {isLoggedIn, isAuthor} = require('../middlewares/auth');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({storage});


router.route('/')
    .get(catchAsync(campgrounds.index))  //display all campgrounds   
    .post(upload.array('img'), validateCampground, catchAsync(campgrounds.createCampground));  //add new campground
    // .post(upload.array('img'), (req,res)=>{
    //     console.log(req.body, req.files);
    //     res.send('IT WORKEEDDDD!!!');
    // })

//render new campground form
router.get("/new", isLoggedIn, campgrounds.renderNewForm);
  
router.route('/:id')
    .get(catchAsync(campgrounds.viewCampground)) //display single campground
    .delete(catchAsync(campgrounds.deleteCampground)) //delete campground
    .put(isLoggedIn, isAuthor,  validateCampground, catchAsync(campgrounds.updateCampground)); //edit campground

//render campground Edit form
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));
  
module.exports = router;  
  
