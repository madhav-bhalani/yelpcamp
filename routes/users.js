const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require ('passport');
// const bcrypt = require('bcrypt');


router.get('/register', (req,res)=>{
    res.render('users/register');
});

router.get('/login', (req,res)=>{
    res.render('users/login');
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 

router.post('/register', catchAsync(async(req,res,next)=>{
    try{
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err=>{
            if(err) return next(err);
            req.flash('success', 'Welcome to YELP CAMP!!');
            res.redirect('/campgrounds');
        }) 
    }
    catch(err){
        req.flash('error', err.message);
        res.redirect('/register');
    }
}));

router.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/login'}),async(req,res)=>{
    req.flash('success', 'Welcome back!!');
    res.redirect('/campgrounds');
});



module.exports = router;    