var express = require('express');
var router = express.Router();
var Autho = require('../Authorize/Autho');



router.get('/', function(req, res, next) {
  res.render('try', { user: req.user });
});


module.exports = router;