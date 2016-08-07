var express = require('express');
var router = express.Router();
var Autho = require('../Authorize/Autho');



router.get('/',  function(req, res){
	if(req.user === undefined){
		res.redirect('/')
	}
	else{
		res.redirect('/admin/' + req.user.username, {user: req.user});
	}
	
})


router.get('/logout', function(req, res) {
	res.redirect('/')
	
	router.get('/', function(req, res, next) {
	  res.render('index1', { });
	});
	req.session.destroy();
	res.render('index1', { });
});

router.put('/:user', function(req, res){
	var query = {"username": req.body.username};
	var statusUpdate = {$set:{status: req.body.status}}
	Account.findOneAndUpdate(query, statusUpdate, {upsert: true}, function(err, person){
		console.log(person);
	})
	console.log(req.body);
})

router.get('/:user', Autho.canDo("view", "administrate"), function(req, res){
	res.render('admin', {user: req.user});
})





module.exports = router;