//Dependencies
var express = require('express');
var router = express.Router();

//Models
var Chart = require('../models/charts');
var Access = require('../models/accountAccess');

//chart
Chart.methods(['get', 'put', 'post', 'delete']);
Chart.register(router, '/charts')

//User
Access.methods(['get', 'put', 'post', 'delete']);
Access.register(router, '/users')

module.exports = router;
