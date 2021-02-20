const express = require('express')
const router = express.Router({mergeParams: true});
const Mo = require('method-override')
const catchAsync = require('../utils/catchAsync');
const apperror = require('../utils/apperror');

const {validatereview, isloggedin, isreviewer} = require('../middleware')
const reviewing = require('../controllers/review')

router.post('/', isloggedin, validatereview, reviewing.postreview)

router.delete('/:reviewid', isloggedin, isreviewer, reviewing.deletereviews)

module.exports = router;