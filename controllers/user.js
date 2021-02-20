const user = require('../models/user');
const catchAsync = require('../utils/catchAsync');

module.exports.register = (req,res)=> {
    res.render('users/register')
}

module.exports.getlogin = (req,res)=> {
    res.render('users/login')
}

module.exports.postregister = catchAsync(async(req,res,next) => {
    try{
    const {email,username,password} = req.body;
    const userdata = new user({email,username});
    const registered = await user.register(userdata, password);
    req.login(registered, err => {
        if(err) return next(err);
        req.flash('success','WELCOME TO YELP CAMP!!!!!!!!!')
        res.redirect('/camps');
    })
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('register')
    }
})

module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success', 'logged out ');
    res.redirect('/camps');
}

module.exports.postlogin = (req,res) => {
    req.flash('success', 'Welcome Back!!');
    const redirecting = req.session.return || '/camps'
    console.log(redirecting);
    delete req.session.return;
    res.redirect(redirecting);
}

