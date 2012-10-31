var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
 

var EngineeringSchema = new Schema({
	name: {type: String},
	user_id: {type: ObjectId, index:true},
	create_at: {type:Date, default:Date.now},
	update_at: {type:Date, default:Date.now}
});

mongoose.model('Engineering', EngineeringSchema);
