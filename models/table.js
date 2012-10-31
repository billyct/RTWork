var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ObjectId = Schema.ObjectId;
 

var TableSchema = new Schema({
	//component_id: {type: ObjectId, index:true},
	work_id: {type: ObjectId, index: true},
	user_id: {type: ObjectId},
	component:{type: String},
	shape: {type: String},
	reinforcedType: {type: String},
	//diameter: {type: Number, default:0},
	sum: {type: Number, default:0},
	shapeLength: {type: Number, default:0},
	totalLength: {type: Number, default:0},
	unitWeight: {type: Number, default:0},
	totalWeight: {type: Number, default:0},
	remark: {type: String},
	create_at: {type:Date, default:Date.now},
	update_at: {type:Date, default:Date.now}
});

mongoose.model('Table', TableSchema);