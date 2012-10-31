var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
 

var ProjectSchema = new Schema({
	name: {type: String},
	engineering_id: {type: ObjectId, index:true},
	user_id: {type: ObjectId},
	work_count: {type: Number, default: 0},
	create_at: {type:Date, default:Date.now},
	update_at: {type:Date, default:Date.now}
});

mongoose.model('Project', ProjectSchema);