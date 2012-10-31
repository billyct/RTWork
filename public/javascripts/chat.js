var socket = io.connect();

$('#add_friend').live('click', function(){
	var friend_name = $('#friend_name').val();
	$.post('/addFriend', {
		friend_name: friend_name
	}, function(data){
		alert(data.message);
		if (data.success == 'success') {
			$('#un_verify_friends').append('<li>'+friend_name+'</li>');
			set_count('#un_verify_friends_count', 1);
			socket.emit('for_verify_friend', friend_name);
		}
	});
	return false;
});

$.contextMenu({
	selector: '.for_verify_friend', 
	callback: function(key, opt) {
	    switch(key){
    			case 'access':
    				var friend_name = opt.$trigger.text();

    				$.post('/verifyFriend', {
    					friend_name: friend_name
    				}, function(data){
    					//console.log(data);
    					if (data.success == 'success') {
    						set_count('#for_verify_friends_count', -1);
    						opt.$trigger.remove();
    						$('ul#online_users').append('<li id="'+friend_name+'"><a href="javascript:void(0);">'+friend_name+'</a></li>');
    						socket.emit('find_online_user', friend_name);
    						socket.emit('verify_friend', friend_name);
    					}
    				});
    				break;
    			case 'cancel':
    				var friend_name = opt.$trigger.text();
    				$.post('/cancelVerifyFriend', {
    					friend_name: friend_name
    				}, function(data){
    					if (data.success == 'success') {
    						set_count('#for_verify_friends_count', -1);
    						opt.$trigger.remove();
    						socket.emit('cancel_verify_friend', friend_name);
    					}
    				});
    				break;
    		}
	},
	items: {
		"access": {name: "确认好友", icon: "quit"},
	     "cancel": {name: "取消确认", icon: "delete"}
	}
});


var $tabs = $( "#chat_room").tabs({
		tabTemplate: "<li id='#{label}'><a href='#{href}'>#{label}</a> <span class='ui-icon ui-icon-close'>close</span></li>",
		add: function( event, ui ) {
			var tab_content = '<div class="content height_300">'+
								'<ul class="full_width">'+
								'</ul>'+
							'</div>'+
							'<div id="scroll_end"></div>';

			$( ui.panel ).append( tab_content );
			$( ui.panel ).appendTo('#chat_room div#chat_room_content');
			$( ui.panel ).addClass('block');
		},
		select: function( event, ui){
			var chat_name = $(ui.tab).parent().attr('id');
			$( 'button#chat_submit' ).attr('chat_name', chat_name);
			var room_name = $(ui.tab).attr('href').split('#tabs-')[1];
			$( 'button#chat_submit' ).attr('room_name', room_name);	
		}
	});


$('ul#online_users li').live('click', function(){
	var friend_name = $.trim($(this).text());
	var tab_title = $('#chat_room ul#chat_room_title');
	var username = $('#chat_form #chat_username').val();
	var room_name = username + '_' + friend_name + '_room';
	if (tab_title.find('li#'+friend_name).length>0) {
		$tabs.tabs('select', "#tabs-" + room_name);
	}else{
		$tabs.tabs( "add", "#tabs-" + room_name, friend_name );
		$tabs.tabs('select', "#tabs-" + room_name);
		socket.emit('add_room', room_name);
		//socket.emit('add_room', room_name);
		socket.emit('add_friend_room', friend_name);
	}
});

$( ".tabs span.ui-icon-close" ).live( "click", function() {
	var index = $( "li", $tabs ).index( $( this ).parent() );
	$tabs.tabs( "remove", index );
});

$('button#chat_submit').live('click', function(){
	// var chat_name = $(this).attr('chat_name');
	var room_name = $(this).attr('room_name');
	var chat_content = $('#chat_content').val();

	//send message to socket
	socket.emit('send_chat', room_name, chat_content);

	$('#chat_content').val('');
	$('#chat_content').focus();

	return false;
});

$('#chat_content').keydown(function(e){
	if (e.keyCode == 13) {
		$('button#chat_submit').click();
		return false;
	}
});

socket.on('connect', function(){
	var username = $('#chat_form #chat_username').val();
	var public_room = 'public_room';
	var user_room = username+'_room';
	socket.emit('add_user', username);
	
	socket.emit('add_room', public_room);
	socket.emit('add_room', user_room);

		//
	var usernames_find_element = $('ul#online_users li');
	var usernames_find = [];
	for (var i = usernames_find_element.length - 1; i >= 0; i--) {
		var username_find = $.trim(usernames_find_element.eq(i).text());
		socket.emit('find_online_user', username_find);
	};
});

socket.on('update_chat', function(room_name, username, message, timeStr){
	var chat_username = $('#chat_form #chat_username').val();
	if (room_name != chat_username+'_room') {
		if ($('#tabs-'+room_name).length<=0 && username != 'SERVER') {
			$tabs.tabs( "add", "#tabs-" + room_name, username );
			$tabs.tabs('select', "#tabs-" + room_name);
		}
		$('#chat_room_content #tabs-'+room_name+' ul').append('<li><h6>'+username+' '+timeStr+':</h6>'+message+'</li>');
		
		var scrollDiv = $('#chat_room_content #tabs-'+room_name+' .content ul');
		$('#chat_room_content #tabs-'+room_name).scrollTop(scrollDiv.height());
	}
});


socket.on('friend_invite_room', function(friend_name, room_name){
	// var username = $('#chat_form #chat_username').val();

	// $tabs.tabs( "add", "#tabs-" + room_name, friend_name );
	// $tabs.tabs('select', "#tabs-" + room_name);
	socket.emit('add_room', room_name);
});

socket.on('set_online_user', function(username_find){
	$('ul#online_users li#'+username_find).find('a').css('color', 'green');
	set_count('#online_users_count', 1);
	// var count = parseInt($('#online_users_count').text());
	// $('#online_users_count').text(count+1);
});

socket.on('set_offline_user', function(username){
	//console.log(username);
	$('ul#online_users li#'+username).find('a').removeAttr('style');
	set_count('#online_users_count', -1);
	// var count = parseInt($('#online_users_count').text());
	// $('#online_users_count').text(count-1);
});

socket.on('set_for_verify_friend', function(username){
	set_count('#for_verify_friends_count', 1);
	$('ul#for_verify_friends').append('<li class="for_verify_friend"><a href="javascript:void(0);">'+username+'</a></li>');
});

socket.on('set_verify_friend', function(username){
	set_count('#un_verify_friends_count', -1);
	$('ul#un_verify_friends li#'+username).remove();
	set_count('#online_users_count', 1);
	$('ul#online_users').append('<li id="'+username+'"><a href="javascript:void(0);" style="color:green;">'+username+'</a></li>');
});

socket.on('set_cancel_verify_friend', function(username){
	set_count('#un_verify_friends_count', -1);
	$('ul#un_verify_friends li#'+username).remove();
});

var set_count = function(id, num){
	var count = parseInt($(id).text());	
	$(id).text(count+num);
}
