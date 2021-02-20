const catchAsync = require('../utils/catchAsync');
const review = require('../models/review')
const campground = require('../models/campground');

module.exports.postreview = catchAsync(async(req,res) => {
    const camping = await campground.findById(req.params.id);
    const rev = new review(req.body.review);
    rev.author = req.user._id;
    camping.reviews.push(rev);
    await rev.save();
    await camping.save();
    req.flash('success', 'Successfully added review')
    res.redirect(`/camps/${camping._id}`)
})

module.exports.deletereviews = catchAsync(async(req,res) => {
    await campground.findByIdAndUpdate(req.params.id,{$pull:{ reviews: req.params.reviewid }});
    await review.findByIdAndDelete(req.params.reviewid);
    req.flash('success', 'Successfully deleted review')
    res.redirect(`/camps/${req.params.id}`)
})

