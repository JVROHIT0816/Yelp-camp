const { campschema, reviewschema} = require('./schemas.js');
const apperror = require('./utils/apperror');
const catchAsync = require('./utils/catchAsync');
const campground = require('./models/campground');
const review = require('./models/review')

module.exports.isloggedin = (req,res,next) => {
if(!req.isAuthenticated()){
    //console.log(req.originalUrl);
    req.session.return = req.originalUrl;
    req.flash('error', "You need to login");
    return res.redirect('/users/login')
}
next();
}

module.exports.validateSchema = (req,res,next) => {
    const { error } = campschema.validate(req.body);
    //console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(', ')
        //console.log(msg);
       throw new apperror(msg,400) 
    }
    else
        next();
}

module.exports.isAuthor = catchAsync( async(req,res,next) => {
    const { id } = req.params;
    const campgrounds = await campground.findById(id);
    if(!campgrounds.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission');
        return res.redirect(`/camps/${id}`);
    }
    next();
})

module.exports.isreviewer = catchAsync(async(req,res,next) => {
    const { id, reviewid } = req.params;
    console.log(reviewid);
    const reviews = await review.findById(reviewid);
    if(!reviews.author.equals(req.user._id)){
        req.flash('error', 'You dont have permission');
        return res.redirect(`/camps/${id}`);
    }
    next(); 
})

module.exports.validatereview = (req,res,next) => {
    const { error } = reviewschema.validate(req.body);
    //console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(', ')
        //console.log(msg);
       throw new apperror(msg,400) 
    }
    else
        next();
}
