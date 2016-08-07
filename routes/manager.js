var express = require('express');
var router = express.Router();
var Autho = require('../Authorize/Autho');



router.get('/', Autho.canDo("view", "manage"), function(req, res){
	res.redirect('/manager/' + req.user.username, {user: req.user});
})

router.get('/logout', function(req, res) {
	res.redirect('/')
	
	router.get('/', function(req, res, next) {
	  res.render('index1', { });
	});
	req.session.destroy();
	res.render('index1', { });
});

router.get('/:user', Autho.canDo("view", "manage"), function(req, res){
	res.render('manager', {user: req.user});
})



module.exports = router;