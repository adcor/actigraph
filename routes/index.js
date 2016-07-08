var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();

//authenticated function
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index1', { user: req.user });
});

router.get('/app', loggedIn, function(req, res, next) {
	  res.render('index', { user: req.user });
});

router.get('/register', function(req, res) {
	res.render('register', { });
});

router.post('/register', function(req, res) {
	Account.register( new Account({ username : req.body.username }), req.body.password, function(err, account) {
		if(err) {
			return res.render('register', { account: account });
		}

		passport.authenticate('local')(req, res, function() {
			res.redirect('/');
		});
	});
});

router.get('/login', function(req, res) {
	res.render('login', { user: req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
	res.redirect('/app');
});

router.get('/logout', function(req, res) {
	router.get('/app', function(req, res, next) {
	  res.render('index1', { user: req.user });
	});
	req.logout();
	res.redirect('/');
});

router.get('/ping', function(req, res){
	res.status(200).send("pong!");
});

module.exports = router;
