//Dependencies

var restful = require('node-restful');
var mongoose = restful.mongoose;


//Schema
var chartSchema = new mongoose.Schema({
	chartName: String,
	activity: String,
	duration: Number
});



//Return model
module.exports = restful.model('Charts', chartSchema);