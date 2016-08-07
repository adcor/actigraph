var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Account = require('../models/account');
var Autho = require('../Authorize/Autho');

//Routes
var admin = require('./admin');
var appRoute = require('./appRoute');
var manager = require('./manager');
var login = require('./login');
var register = require('./register');
var tryRoute = require('./tryRoute');

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

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

router.put('admin/:user', function(req, res){
	var query = {"username": req.body.username};
	var statusUpdate = {$set:{status: req.body.status}}
	Account.findOneAndUpdate(query, statusUpdate, {upsert: true}, function(err, person){
		console.log(person);
	})
	console.log(req.body);
})

router.use('/app', appRoute);
router.use('/admin', admin);
router.use('/manager', manager);
router.use('/login', login);
router.use('/register', register);
router.use('/try', tryRoute);




module.exports = router;
