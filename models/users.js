var restful = require('node-restful');
var mongoose = restful.mongoose;


//Schema
var userSchema = new mongoose.Schema({
	username: { type: String, required: true, index: { unique: true} },
	password: { type: Number, required: true },
	charts: [ {type: mongoose.Schema.Types.ObjectId, ref: 'Charts'} ]
});



//Return model
module.exports = restful.model('Users', userSchema);