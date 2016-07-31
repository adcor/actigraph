var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var restful = require('node-restful');

var Account = new Schema({
	username: String,
	password: String,
	status: String
});


module.exports = restful.model('Access', Account);