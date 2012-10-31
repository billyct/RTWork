var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
 

var WorkSchema = new Schema({
	name: {type: String},
	user_id: {type: ObjectId},
	project_id: {type: ObjectId},
	create_at: {type:Date, default:Date.now},
	update_at: {type:Date, default:Date.now}
});

mongoose.model('Work', WorkSchema);