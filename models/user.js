var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
	
var UserSchema = new Schema({
	name: {type: String, index:true},
	engineering_working_id: {type: ObjectId},
	pass: {type: String},
	email: {type: String},
	verifyFriends : {type: Array},
	unVerifyFriends: {type: Array},
	forVerifyFriends: {type: Array}
});

mongoose.model('User', UserSchema);