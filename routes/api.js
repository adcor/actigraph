//Dependencies
var express = require('express');
var router = express.Router();

//Models
var Chart = require('../models/charts');

/* GET users listing. */
Chart.methods(['get', 'put', 'post', 'delete']);
Chart.register(router, '/charts')

module.exports = router;
