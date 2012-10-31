
$('button#open_work_dialog').live('click', function() {
	//console.log($("#work_dialog"));
	$("#work_dialog").dialog("open");
	return false;
});

$('#work_dialog #create_work').live('click', function() {
	var work_name = $('#work_dialog #work_name').val();
	var project_name = $('#main_container > .project:visible').attr('id');
	console.log(project_name);
	$.post('work/create', {
		work_name : work_name,
		project_name : project_name
	}, function(data) {
		if(data.success == 'failed') {
			alert(data.work_name + '表创建失败' + data.message);
			return false;
		} else if(data.success == 'success') {
			alert(data.work_name + '表创建成功' + data.message);
			var work_li_html = '<li class="work" id="' + work_name + '" work_id="' + data.work_id + '">' + '<a href="javascript:void(0);">' + '<img src="images/gallery/blue/image05_thumb.jpg"/>' + '<span class="name">' + data.work_name + '</span></a>' + '</li>';
			$('#main_container > .project:visible #works ul').append(work_li_html);
			$('#works li.work').draggable({
				revert: "invalid", // when not dropped, the item will revert back to its initial position
				helper: "clone",
				cursor: "point",
				opacity: 0.7
			});
			$('#work_dialog').dialog('close');
			var work_count = parseInt($('#sidebar #my_projects li#'+project_name).find('span').html());
			$('#sidebar #my_projects li#'+project_name).find('span').html(work_count+1);
		}
	});
	return false;
});




$.contextMenu({
    selector: '#works .work', 
    callback: function(key, opt) {
    		switch(key){
    			case 'edit':
    				work_edit(opt);
    				break;
    			case 'delete':
    				work_delete(opt);
    				break;
    		}
    },
    items: {
        "edit": {name: "编辑", icon: "edit"},
        "delete": {name: "删除", icon: "delete"},
    }
});



var work_edit = function(opt){
	$('#work_edit_dialog').dialog("open");
	$('#work_edit_dialog #edit_work').click(function(e){
		var project_name = $('#main_container > .project:visible').attr('id');
		var work_old_name = opt.$trigger.attr('id');
	    	var work_name = $('#work_edit_name').val();
	    	if (work_name == work_old_name) {
	    		alert('表堆名不能相同');
	    		return false;
	    	}
	    	$.post('work/save', {
	    		work_old_name: work_old_name,
	    		work_name: work_name,
	    		project_name: project_name
	    	}, function(data){
	    		if (data.success == 'success') {
	    			opt.$trigger.children('a').children('span').html(work_name);
	    			opt.$trigger.attr('id', work_name);
	    			$('#work_edit_dialog').dialog('close');
	    		}else{alert(data.message);}
	    	});
	     $('#work_edit_dialog #edit_work').unbind('click');
	    	return false;
	});
	//$('#work_edit_dialog #edit_work').unbind('click');

}


var work_delete = function(opt){
	var project_name = $('#main_container > .project:visible').attr('id');
	var work_name = opt.$trigger.attr('id');
	$.post('work/delete', {
		project_name: project_name,
		work_name: work_name
	}, function(data){
		if (data.success == 'success') {
			opt.$trigger.remove();
			var work_count = parseInt($('#sidebar #my_projects li#'+project_name).find('span').html());
			if (work_count > 0) {
				$('#sidebar #my_projects li#'+project_name).find('span').html(work_count-1);
			};
		}else{alert(data.message);}
	});

	return false;
}

$('li.work').live('click', function(){
	var work_id = $(this).attr('work_id');
	var work_name = $(this).attr('id');
	var project_name = $('#main_container > .project:visible').attr('id');

	if (!$('table#'+work_id)[0]) {
		$.get('table/main', {
			work_id: work_id
		}, function(data){
			$.window.prepare({
			   dock: 'bottom',       // change the dock direction: 'left', 'right', 'top', 'bottom'
			   //dockArea: $('#template_options')
			   handleScrollbar: true
			});
			var winid = $.window({
				draggable: false,
				showModal: false,
				icon: 'images/icons/large/white/Document.png',
				modalOpacity: 0.5,
				title: project_name + ':' +work_name,
				content: data,
				width: '99%',
				height: '95%',
				maxWidth: '99%',
				maxHeight: '95%',
				showFooter: false,
				y: 3
			}).getWindowId();
			$('li.work#'+work_name).attr('winid', winid);
		});
	}else{
		var winid = $(this).attr('winid');
		$.window.getWindow(winid).show();
		// wnd.show();

	}
	return false;

});






