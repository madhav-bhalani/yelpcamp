const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require ('passport');
const {storeReturnTo} = require('../middlewares/auth');
const users = require('../controllers/users');
// const bcrypt = require('bcrypt');


router.route('/register')
    .get(users.renderRegisterForm) //render register form
    .post(catchAsync(users.resgisterUser)); //register user

router.route('/login')
    .get(users.renderLoginForm) //render login form
    .post(storeReturnTo,passport.authenticate('local',{
        failureFlash: true, failureRedirect: '/login'}), catchAsync(users.loginUser)); //login user

//logout user        
router.get('/logout', (users.logoutUser)); 


module.exports = router;    