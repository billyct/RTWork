function fomatFloat(src,pos){
	return Math.round(src*Math.pow(10, pos))/Math.pow(10, pos);
}

$('button#save_table').live('click', function(){	
	var form = $(this).parent('form');
	var work_id = form.parents('#wrapper').attr('work_id');

	var component = form.children('#'+work_id+'component').val().toUpperCase();
	var shape = form.children('#'+work_id+'shape').val();
	var reinforcedType = form.children('#'+work_id+'reinforcedType').val();
	var sum = form.children('#'+work_id+'sum').val();
	var remark = form.children('#'+work_id+'remark').val();


	try{
		var shapeLength = parseFloat(eval(shape));//danger!!!!!!!!!!
		//shapeLength = parseFloat(shapeLength);
	}catch(err){
		alert('请输入正确的形状');
		return false;
	}
	

	var reinforcedNum = reinforcedType.match(/[\d\.]+/);

	var totalLength = parseFloat(shapeLength*sum);

	var unitWeight = reinforcedTypeModel[reinforcedNum];
	if (!unitWeight) {
		alert('请输入正确的钢筋');
	}
	var totalWeight = fomatFloat(parseFloat(shapeLength*unitWeight*sum), 2);

	$.post('table/create', {
		work_id: work_id,
		component: component,
		shape: shape,
		reinforcedType: reinforcedType,
		sum: sum,
		shapeLength: shapeLength,
		totalLength: totalLength,
		unitWeight: unitWeight,
		totalWeight :totalWeight,
		remark: remark
	}, function(data){
		if (data.success == 'success') {
			var tableNew = $('table#'+work_id).dataTable().fnAddData([
				component,
				shape,
				reinforcedType,
				sum,
				shapeLength,
				totalLength,
				unitWeight,
				totalWeight,
				remark,
				'<a href="javascript:void(0);" id="delete"><img src="images/icons/small/grey/Trashcan.png" width="24" height="24" alt="删除" title="删除" /></a>'
			]);
			var tableNewRow = $('table#'+work_id).dataTable().fnGetNodes(tableNew[0]);
			$(tableNewRow).attr('id', data.table_id);
			$(tableNewRow).children(':lt(4)').attr('class', 'editable');
			$(tableNewRow).children(':eq(8)').attr('class', 'editable');
			$('table#'+work_id).dataTable().fnDraw();
			tableEdit(work_id);
		}else{alert(data.message);}

		// $('img[title]').tipsy({
		// 	trigger: 'focus',  
		// 	offset:'5',
		// 	gravity: 'w'
		// });
	});

	return false;
});


$('.my_tables tr td a#delete').live('click', function(){
	var id = $(this).parents('tr').attr('id');
	var work_id = $(this).parents('#wrapper').attr('work_id');
	//get the td dom for use of the dataTable get position and then delete the row
	var tdDom = $(this).parent('td')[0];
	$.post('table/delete', {
		id: id
	}, function(data){
		if (data.success == 'success') {
			var tableDelete = $('table#'+work_id).dataTable();
			//console.log(tdDom);
			var aPos = tableDelete.fnGetPosition(tdDom);
			console.log(aPos);
			tableDelete.fnDeleteRow(aPos[0]);
		}else{alert(data.message);}
	});
	return false;
});


var tableEdit = function(work_id){
	$('table#'+work_id+' tbody td.editable').editable('table/save', {
		'callback': function(data, settings){
			//fuck do the string to object
			eval('data = '+ data);
			if (data['success'] == 'success') {
				var aPos = $('table#'+work_id).dataTable().fnGetPosition(this);
				data['value'].push('<a href="javascript:void(0);" id="delete"><img src="images/icons/small/grey/Trashcan.png" width="24" height="24" alt="删除" title="删除" /></a>');
				$('table#'+work_id).dataTable().fnUpdate(data['value'], aPos[0]);
			}else{
				return false;
			}
		},
		'submitdata' : function(value, settings){
			return {
				'id' : $(this).parent().attr('id'),
				'pos': $('table#'+work_id).dataTable().fnGetPosition(this)[2]
			}
		},
		'data': function(value, settings) {
			console.log(value);
			console.log(settings);
			return value;
		},
		'height': '14px',
		'width': '100%'
	});
}

var tableSearch = function(o, project_name){
	var works = new Array();
	$.each($(o).children('li'), function(i,el){
		works.push($(el).attr('work_id'));
	});
	if (works.length > 0) {
		$.post('table/search', {
			works : works
		}, function(data){
			if (data.success == 'success') {
				var component_data = data.componentData;
				var reinforced_data = data.reinforcedData;
				$('#'+project_name+' #works_search_data #component_data ul').empty();
				$('#'+project_name+' #works_search_data #reinforced_data ul').empty();

				for(var component in component_data){
					var component_data_show = '<li><strong>'+component+'</strong>:'+component_data[component]+'</li>';
					$('#'+project_name+' #works_search_data #component_data ul').append(component_data_show);
					// console.log(component);
					// console.log(component_data[component]);
				}

				for(var reinforced in reinforced_data){
					var reinforced_data_show = '<li><strong>'+reinforced+'</strong>:'+reinforced_data[reinforced]+'</li>';
					$('#'+project_name+' #works_search_data #reinforced_data ul').append(reinforced_data_show);
					// console.log(reinforced);
					// console.log(reinforced_data[reinforced]);
				}

			}
			return false;
		});
	}
}

$.contextMenu({
    selector: '#works_search ul li:not(.placeholder)', 
    callback: function(key, opt) {
    		switch(key){
    			case 'delete':
    				var ul = opt.$trigger.parent();
    				var project_name = $('#main_container > .project:visible').attr('id');
    				opt.$trigger.remove();
    				tableSearch(ul, project_name);
    				break;
    		}
    },
    items: {
        "delete": {name: "删除", icon: "delete"},
    }
});