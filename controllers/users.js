const User = require('../models/user');

module.exports.renderRegisterForm = (req,res)=>{
    res.render('users/register');
}

module.exports.renderLoginForm =  (req,res)=>{
    res.render('users/login');
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}

module.exports.resgisterUser = async(req,res,next)=>{
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
}

module.exports.loginUser = async(req,res)=>{
    req.flash('success', 'Welcome back!!');
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}