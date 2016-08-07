var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Account = require('../models/account');
var router = express.Router();
var Autho = require('../Authorize/Autho');

router.get('/', function(req, res) {
	res.render('register', { });
});

router.post('/', function(req, res) {
	Account.register( new Account({ username : req.body.username , status: "member"}), req.body.password, function(err, account) {
		if(err) {
			return res.render('register', { account: account });
		}

		passport.authenticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
});




module.exports = router;