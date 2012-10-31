$("#work_dialog").dialog({
	autoOpen : false,
	show : "fade",
	hide : "fade",
	modal: true
});


$( "#engineerings_dialog" ).dialog({
	autoOpen: false, 
	show: "fade",
	hide: "fade",
	modal: true,
	height: 600,
	width: 400
});

$( "#work_edit_dialog" ).dialog({
	autoOpen: false, 
	show: "fade",
	hide: "fade",
	modal: true
});

//js for topnav 
var navClickEvent = function(id){
	$('#nav_top ul #'+id).click(function(){
		$('#nav_top ul li').attr('class', '');
		$(this).attr('class', 'current');
		$('#main_container > #projects').fadeOut("slow");
		$('#main_container > .project').fadeOut("slow");
		$('#main_container > #'+id).show();
	});
}

navClickEvent('projects');


$( "ul#accordion" ).accordion({
	collapsible: true,
	active:0,
	header: 'li a.top_level',
	autoHeight:false,
	icons:false
});

$( "#open_engineerings_dialog" ).click(function() {
	//$.get('engineering/create');
	$( "#engineerings_dialog" ).dialog( "open" ); 
	return false;
});

var project_name = '';

$('#chat_room').live('click', function(){
	$.window.prepare({
	   dock: 'left',       // change the dock direction: 'left', 'right', 'top', 'bottom'
	   //dockArea: $('#template_options')
	   handleScrollbar: true
	});
	var winid = $.window({
		draggable: true,
		showModal: true,
		icon: 'images/icons/large/white/Android.png',
		modalOpacity: 0.5,
		width: 800,
		height: 600,
		title: '即时通讯',
		//content: data,
		url: "/chat",
		// onClose: function(){
		// 	if (window.confirm( "logout?")) {
		// 		$.post('/offline');
		// 	}else{
		// 		return;
		// 	}
			
		// },
		showFooter: false,
		y: 3
	}).getWindowId();
});