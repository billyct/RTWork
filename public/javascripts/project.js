var projectTable = $('.table#my_projects').dataTable( {
		"bJQueryUI": true,
		"sScrollX": "",
		"bSortClasses": false,
		"aaSorting": [[0,'asc']],
		"bAutoWidth": true,
		"bInfo": true,
		"sScrollY": "100%",	
		"sScrollX": "100%",
		"bScrollCollapse": true,
		"sPaginationType": "full_numbers",
		"bRetrieve": true,
		"oLanguage": {
            "sLengthMenu": "每页显示 _MENU_ 条",
            "sZeroRecords": "没有数据",
            "sInfo": "显示 _TOTAL_ 条记录里的 _START_ 到 _END_ 条数据",
            "sInfoEmpty": "没有数据",
            //"sInfoFiltered": "(filtered from _MAX_ total records)"，
            "sSearch": "搜索:",
            "oPaginate": {
				"sFirst":    "第一页",
				"sPrevious": "上页",
				"sNext":     "下页",
				"sLast":     "最后页"
		  }
        }
	});

$('#projects #create_project').live('click', function(event) {
	var project_name = $('#projects #project_name').val();
	console.log(project_name);
	$.post('project/create', {
		project_name: project_name
	}, function(data){
		
		if (data.success == 'success') {
			var operateHtml = '<a href="javascript:void(0);" id="operating"><img src="images/icons/small/grey/Book%20Large.png" width="24" height="24" alt="操作" title="操作" /></a>'+
						'<a href="javascript:void(0);" id="edit"><img src="images/icons/small/grey/Create Write.png" width="24" height="24" alt="修改" title="修改" /></a>'+
						'<a href="javascript:void(0);" id="delete"><img src="images/icons/small/grey/Trashcan.png" width="24" height="24" alt="删除" title="删除" /></a>';
			//$('#my_projects > tbody').append('<tr id="'+project_name+'"><td>'+data.project_name+'</td>'+operateHtml+'</tr>');
			var projectNew = $('.table#my_projects').dataTable().fnAddData([
				project_name,
				operateHtml
			]);

			var projectNewRow = $('.table#my_projects').dataTable().fnGetNodes(projectNew[0]);
			$(projectNewRow).attr('id', project_name);

			$('#sidebar #my_projects').append('<li id="'+project_name+'">'+
								'<a href="javascript:void(0);">'+project_name+'</a>'+
								'<span class="alert badge alert_grey">0</span></li>');
			$('img[title]').tipsy({
				fade: true,     // fade tooltips in/out?
				fallback: '',    // fallback text to use when no tooltip text
				gravity: 's',    // gravity
			 	opacity: 1,    // opacity of tooltip
				title: 'title',  // attribute/callback containing tooltip text
				trigger: 'hover' // how tooltip is triggered - hover | focus | manual    	
			});
		}else{alert(data.message);}
	});
	
	return false;
});

$('#projects #my_projects #edit').live('click', function() {
	var td_edit = $(this).parent().prev();
	var project_name = td_edit.html();
	td_edit.empty();
	td_edit.append('<input type="text" id="my_project_name" value="'+ project_name+'" />');
	$(this).attr('id','save');
	$(this).children().attr('title','保存');
});

$('#projects #my_projects #save').live('click', function(){
	var td_edit = $(this).parent().prev();
	var project_name = td_edit.children('#my_project_name').val();
	var project_old_name = td_edit.parent().attr('id');
	
	if (project_name != project_old_name) {
		if (project_name != '') {
			$.post('project/save', {
				project_old_name : project_old_name,
				project_name: project_name
			}, function(data){
				if (data.success == 'success') {
					//alert(data.message);
				} else{
					alert(data.message);
				}
			});
		}else{
			alert('请输入你要修改成的项目名称');
			return false;
		}
	}
	
	td_edit.empty();
	td_edit.append(project_name);
	$(this).attr('id','edit');
	$(this).children().attr('title','修改');
	td_edit.parent().attr('id', project_name);
});

$('#projects #my_projects #delete').live('click', function() {
	var tr_edit = $(this).parent().parent();
	var project_name = tr_edit.attr('id');
	var tdDom = $(this).parent('td')[0];
	//var project_name = td_edit.html();
	$.post('project/delete', {
		project_name: project_name
	},function(data){
		if (data.success == 'success') {
			//return false;
			var projectDelete = $('.table#my_projects').dataTable();
			var pos = projectDelete.fnGetPosition(tdDom);
			$('.tipsy').hide();
			projectDelete.fnDeleteRow(pos[0]);
			$('#sidebar #my_projects li#'+project_name).remove();
			//$(this).tipsy("hide");
			//tr_edit.remove();
		}else{alert(data.message);}	
	});
	return false;
});

$('#projects #my_projects #operating, #sidebar #my_projects li a').live('click', function(event) {
	console.log($(this));
	
	var tr_edit = $(this).parent().parent();
	var project_name = tr_edit.attr('id');

	if ($(this).parent()[0].tagName != 'TD') {
		project_name = $(this).html();
	}

	if (!$('#main_container > #'+project_name)[0]) {
		$.get('work/main', {
			project_name : project_name
		}, function(data){
			var nav_html = '<li class="current" id="'+project_name+'"><a href="javascript:void(0);"><img src="images/icons/small/white/Create Write.png"/>'+project_name+'</a></li>'
			$('#main_container > #projects').fadeOut("slow");
			$('#main_container > .project').fadeOut("slow");
			$('#nav_top ul').append(nav_html);
			$('#nav_top ul li').attr('class', '');
			$('#nav_top ul > #'+project_name).attr('class', 'current');
			$('#main_container').append(data);
			$( ".content_accordion" ).accordion({
				collapsible: true,
				active:false,
				header: 'h3.bar', // this is the element that will be clicked to activate the accordion 
				autoHeight:false,
				event: 'mousedown',
				icons:false,
				animated: true
			});
			//workFunctions();
			//work_menu();
			navClickEvent(project_name);
		});
	}else{
		$('#main_container > #projects').fadeOut("slow");
		$('#main_container > .project').fadeOut("slow");
		$('#nav_top ul li').attr('class', '');
		$('#nav_top ul > #'+project_name).attr('class', 'current');
		$('#main_container > #'+project_name).show();
	}
	return false;
});
