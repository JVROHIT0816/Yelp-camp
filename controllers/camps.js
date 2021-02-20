const catchAsync = require('../utils/catchAsync');
const campground = require('../models/campground');
const {cloudinary} = require('../cloudinary')
const mapboxgeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const maptoken = process.env.mapboxtoken
const geocode = mapboxgeocoding({accessToken: maptoken})

module.exports.index = catchAsync(async(req,res,next) => {
    const campgrounds = await campground.find().populate('author');
    res.render('camp/index', {campgrounds})
})

module.exports.getnew = (req,res) => {
    res.render('camp/new');
}

module.exports.getbyid = catchAsync(async(req,res) => {
    const campgrounds = await campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    //console.log(campgrounds)
    if(!campgrounds){
        req.flash('error','Cannot  find that campground!');
        return res.redirect('/camps')
    }
    res.render('camp/show', {campgrounds})
})

module.exports.getedit = catchAsync(async(req,res) => {
    const campgrounds = await campground.findById(req.params.id);
    if(!campgrounds){
        req.flash('error','Cannot  find that campground!');
        return res.redirect('/camps')
    }
    res.render('camp/edit', {campgrounds})
})

module.exports.putedit = catchAsync(async(req,res) => {
    //console.log("enter");
    const{ id } = req.params;
    const camp = await campground.findByIdAndUpdate(id,{...req.body.camp}) 
    const images = req.files.map(f => ({url: f.path, filename:f.filename}))
    camp.image.push(...images);
    await camp.save();
    if(req.body.deleteimage){
        for(let file of req.body.deleteimage){
            console.log(file);
            await cloudinary.uploader.destroy(file)
        }
        await camp.updateOne({$pull: {image: {filename: {$in: req.body.deleteimage}}}})
        //console.log(camp);
    }
    req.flash('success', 'Successfully updated campground')
    res.redirect(`/camps/${camp._id}`)
})

module.exports.postnew = catchAsync(async(req,res,next) => {
    //if(!req.body.camp) {console.log(req.body); throw new apperror('Invalid Data', 400);}
    const geodata = await geocode.forwardGeocode({
        query: req.body.camp.location,
        limit: 1
    }).send() 
    const campgrounds = new campground(req.body.camp);
    campgrounds.image = req.files.map(f => ({url: f.path, filename:f.filename}))
    campgrounds.author = req.user._id;
    campgrounds.geometry = geodata.body.features[0].geometry
    await campgrounds.save();
    //console.log(campgrounds);
    req.flash('success', 'Successfully added campground')
    res.redirect(`/camps`);

})

module.exports.deletecamp = catchAsync(async(req,res) => {
    const{ id } = req.params;
    await campground.findByIdAndDelete(id)
    req.flash('success', 'Successfully deleted campground')
    res.redirect(`/camps`)
})