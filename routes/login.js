var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Account = require('../models/account');
var Autho = require('../Authorize/Autho');
var router = express.Router();
var Autho = require('../Authorize/Autho');


router.get('/', function(req, res) {
	res.render('login', { user: req.user });
});

router.post('/', passport.authenticate('local', {session: true}), function(req, res) {
	console.log(req.user)
	res.redirect('/app/' + req.user.username);
});





module.exports = router;