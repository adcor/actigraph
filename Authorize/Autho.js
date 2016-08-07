var express = require('express');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Account = require('../models/account');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//Auth Check
function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/login');
    }
}

var Role = function(status, canAccess, resources) {
	this.status = status;
	this.rights = canAccess;
	this.resources = resources;
}

//Define Roles
var Member = new Role("member", ["view"], ["home"]);

var Manager = new Role("manager", ["view"], ["home", "manage"]);

var Admin = new Role("admin", ["view"], ["home", "manage", "administrate"]);

var roles = [Member, Manager, Admin];

function canDo(Rights, Resource){
	var resource = Resource;
	var access = Rights;
	return function(req, res, next){
		var stat = req.user.status;
		var can = false;
		var Do = false;

		
		
		for(var i = 0; i < roles.length; i++){
			console.log(roles[i].status);

			if(roles[i].status === stat){
				console.log("hit")
				for(var m = 0; m < roles[i].resources.length; m++){
					console.log(roles[i].resources);
					if(roles[i].resources[m] === resource){
						can = true;
						console.log("Checking if in for")
					}
				}
				for(var k = 0; k < roles[i].rights.length; k++){
					console.log(roles[i].rights);
					if(roles[i].rights[k] === access){
						Do = true;
						console.log("Checking Do")
					}
				}

			}
		}
		console.log("Can bool is " + can);
		if(can === false || Do === false){
			return res.redirect("/app/" + req.user.username);
		}
		else {
			return next();
		}

	}
}
module.exports = {
	canDo: canDo,
	loggedIn: loggedIn

}