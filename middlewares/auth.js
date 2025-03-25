const isLoggedIn = async(req, res, next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'you must be signed in..');
        return res.redirect('/login');
    }
    next();
}

module.exports = isLoggedIn;


