function get_time(){
	var dateTime = new Date();
     return dateTime.getHours()+':'+dateTime.getMinutes()+':'+dateTime.getSeconds();
}

exports.get_time = get_time;