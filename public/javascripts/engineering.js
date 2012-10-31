var my_engineerings_table = $('#my_engineerings').dataTable({
		"bJQueryUI": true,
		"bSortClasses": false,
		//"bSort": false,
		"aaSorting": [[0,'asc']],
		"bAutoWidth": true,
		"bInfo": false,
		"sScrollY": "100%",	
		"sScrollX": "368px",
		"sScrollXInner": "100%",
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




$('#create_engineering').live('click', function(){
	var engineering_name = $('#engineerings_dialog #engineering_name').val();
	console.log(engineering_name);
	$.post('/engineering/create', {engineering_name: engineering_name}, function(data){
		if(data.success == 'failed'){
			alert(data.engineering_name+data.message);
			return false;	
		}else if(data.success == 'success'){
			//alert(data.engineering_name+data.message);
			var operateHtml = '<a href="javascript:void(0);" id="operating"><img src="images/icons/small/grey/Book%20Large.png" width="24" height="24" alt="操作" title="操作" /></a>'+
							'<a href="javascript:void(0);" id="edit"><img src="images/icons/small/grey/Create Write.png" width="24" height="24" alt="修改" title="修改" /></a>'+
							'<a href="javascript:void(0);" id="delete"><img src="images/icons/small/grey/Trashcan.png" width="24" height="24" alt="删除" title="删除" /></a>';
			//$('#my_engineerings > tbody').append('<tr id="'+engineering_name+'"><td>'+data.engineering_name+'</td><td>'+operateHtml+'</td></tr>');
			var engineeringNew = $('#my_engineerings').dataTable().fnAddData([
					data.engineering_name,
					operateHtml
			]);

			var engineeringNewRow = $('#my_engineerings').dataTable().fnGetNodes(engineeringNew[0]);
			$(engineeringNewRow).attr('id', engineering_name);
			$('#my_engineerings').dataTable().fnDraw();
			$('img[title]').tipsy({
				fade: true,     // fade tooltips in/out?
				fallback: '',    // fallback text to use when no tooltip text
				gravity: 's',    // gravity
			 	opacity: 1,    // opacity of tooltip
				title: 'title',  // attribute/callback containing tooltip text
				trigger: 'hover' // how tooltip is triggered - hover | focus | manual    	
			});
		}
	});
	return false;
});

$('#my_engineerings #edit').live('click', function() {
	var td_edit = $(this).parent().prev();
	var engineering_name = td_edit.html();
	td_edit.empty();
	td_edit.append('<input type="text" id="my_engineering_name" value="'+ engineering_name+'" />');
	$(this).attr('id','save');
	$(this).children().attr('title','保存');
});

$('#my_engineerings #save').live('click', function(){
	var td_edit = $(this).parent().prev();
	var engineering_name = td_edit.children('#my_engineering_name').val();
	var engineering_old_name = td_edit.parent().attr('id');
	
	if (engineering_name != engineering_old_name ) {
		if (engineering_name != '') {
			$.post('engineering/save', {
				engineering_old_name : engineering_old_name,
				engineering_name: engineering_name
			}, function(data){
				
				if (data.success == 'success') {
					td_edit.empty();
					td_edit.append(engineering_name);
					$(this).attr('id','edit');
					$(this).children().attr('title','修改');
					td_edit.parent().attr('id', engineering_name);
				}else{
				alert(data.message);
				}
				return false;
			});
		} else{
			alert('请输入你要修改成的工程名称');
			return false;
		}
	}
	
	
});

$('#my_engineerings #delete').live('click', function() {
	var tr_edit = $(this).parents('tr');
	var engineering_name = tr_edit.attr('id');
	var tdDom = $(this).parent('td')[0];
	//var engineering_name = td_edit.html();
	$.post('engineering/delete', {
		engineering_name: engineering_name
	},function(data){
		
		if (data.success == 'success') {
			//return false;
			var engineeringDelete = $('#my_engineerings').dataTable();
			var pos = engineeringDelete.fnGetPosition(tdDom);

			$('.tipsy').hide();
			engineeringDelete.fnDeleteRow(pos[0]);
			//$('#my_engineerings').dataTable().fnDeleteRow(tr_edit);
		}else{alert(data.message);}	
	});
	return false;
});

$('#my_engineerings #operating').live('click', function(event) {
	var tr_edit = $(this).parent().parent();
	var engineering_name = tr_edit.attr('id');
	$.post('user/set_engineering', {
		engineering_working_name : engineering_name
	}, function(data){
		if(data.success == 'success'){
			location.href = '/'; 
			// $('#sidebar #engineering_name').text(engineering_name);
			// $('#engineerings_dialog').dialog('close');
		}else{alert(data.message);}
	});
	return false;
});
