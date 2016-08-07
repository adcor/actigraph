var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Account = require('../models/account');
var router = express.Router();
var Autho = require('../Authorize/Autho');

router.get('/', Autho.loggedIn, function(req, res, next) {
	  console.log(req.user);

	  res.redirect('/app/' + req.user.username);
});


router.get('/:user', Autho.loggedIn, function(req, res, next) {
	  console.log(req.user);
	  res.render('index', { user: req.user });
});

router.get('/logout', function(req, res) {
	res.redirect('/')
	
	router.get('/', function(req, res, next) {
	  res.render('index1', { });
	});
	req.session.destroy();
	res.render('index1', { });
});





module.exports = router;