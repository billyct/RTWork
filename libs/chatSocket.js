var config = require('../config').config;
var arrayLib = require('./arrayLib');
var timeLib = require('./timeLib');



exports.chat_socket = function(usernames, app){
  var io = require('socket.io').listen(app);
  io.sockets.on('connection', function(socket){
    var user_socket = {
      rooms : [],
      friends: []
    };
    var SERVER_NAME = 'SERVER';
    //add user to public room
    socket.on('add_user', function(username){
      user_socket.username = username;
      if (!usernames[username]) {
        usernames[username] = username;
      }
      //socket.emit('update_users', usernames);
      
    });

    socket.on('add_room', function(room_name){
      if(!arrayLib.in_array(room_name, user_socket.rooms)){
        user_socket.rooms.push(room_name);
        socket.join(room_name);
        socket.emit('update_chat', room_name, SERVER_NAME, '你已经连接成功', timeLib.get_time());
      }
    });

    socket.on('add_friend_room', function(friend_name){
      var room_name = user_socket.username+'_'+friend_name+'_room';
      io.sockets.in(friend_name+'_room').emit('friend_invite_room', user_socket.username, room_name);
      
    });


    //send chat
    socket.on('send_chat', function(room_name, message){
      io.sockets.in(room_name).emit('update_chat', room_name, user_socket.username, message, timeLib.get_time());
    });


    //disconnect 
    socket.on('disconnect', function(){
      delete usernames[user_socket.username];
      for (var i = user_socket.friends.length - 1; i >= 0; i--) {
        if(usernames[user_socket.friends[i]]){
          io.sockets.in(user_socket.friends[i]+'_room').emit('set_offline_user', user_socket.username);
        }
      }
      for (var i = 0; i < user_socket.rooms.length; i++) {
        socket.leave(user_socket.rooms[i]);
      }
    });

    socket.on('find_online_user', function(username_find){
      user_socket.friends.push(username_find);
      if (usernames[username_find]) {
        socket.emit('set_online_user', username_find);
        io.sockets.in(username_find+'_room').emit('set_online_user', user_socket.username);
      }
    });

    socket.on('for_verify_friend', function(username){
      if (usernames[username]) {
        io.sockets.in(username+'_room').emit('set_for_verify_friend', user_socket.username);
      }

    });

    socket.on('verify_friend', function(username){
      user_socket.friends.push(username);
      if (usernames[username]) {
        io.sockets.in(username+'_room').emit('set_verify_friend', user_socket.username);
      }
    });

    socket.on('cancel_verify_friend', function(username){
      if (usernames[username]) {
        io.sockets.in(username+'_room').emit('set_cancel_verify_friend', user_socket.username);
      }
    })

  });
}
