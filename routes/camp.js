const express = require('express')
const Mo = require('method-override')
const catchAsync = require('../utils/catchAsync');
const multer = require('multer')
const campground = require('../models/campground');
const router = express.Router();
const camping = require('../controllers/camps')
const {storage} = require('../cloudinary');
const upload = multer({storage});

const {isloggedin, isAuthor, validateSchema} = require('../middleware')




router.route('/')
    .get(camping.index)
    .post(isloggedin, upload.array('image'), validateSchema, camping.postnew)

router.get('/new', isloggedin, camping.getnew)

router.route('/:id')
    .get(camping.getbyid)
    .put(isloggedin, isAuthor, upload.array('image'), validateSchema, camping.putedit)
    .delete(isloggedin, isAuthor, camping.deletecamp)



router.get('/:id/edit', isloggedin, isAuthor, camping.getedit)



router
module.exports = router;

//