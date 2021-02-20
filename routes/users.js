const express = require('express');
const user = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const apperror = require('../utils/apperror');
const passport = require('passport');
//const { delete } = require('./camp');
const router = express.Router();
const registering = require('../controllers/user')

router.route('/register')
    .get(registering.register)
    .post(registering.postregister);

router.route('/login')
    .get( registering.getlogin)
    .post(passport.authenticate('local',{failureFlash: true, failureRedirect:'login'}), registering.postlogin);

router.get('/logout', registering.logout)

module.exports = router;