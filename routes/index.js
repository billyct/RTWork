//这是一个路由控制对应的控制器的文件
var index_ctrl = require('../controllers');
exports.index = index_ctrl.index;
exports.error = index_ctrl.error;

var site_ctrl = require('../controllers/site');
//exports.slidebar = site_ctrl.slidebar;

var sign_ctrl = require('../controllers/sign');
exports.signin = sign_ctrl.signin;
exports.signup = sign_ctrl.signup;
exports.signout = sign_ctrl.signout;

exports.auth_user = sign_ctrl.auth_user;

var engineering_ctrl = require('../controllers/engineering');
exports.create_engineering = engineering_ctrl.create;
exports.save_engineering = engineering_ctrl.save;
exports.delete_engineering = engineering_ctrl.delete;

var project_ctrl = require('../controllers/project');
exports.create_project = project_ctrl.create;
exports.save_project= project_ctrl.save;
exports.delete_project = project_ctrl.delete;

var work_ctrl = require('../controllers/work');
exports.create_work = work_ctrl.create;
exports.save_work = work_ctrl.save;
exports.delete_work = work_ctrl.delete;
exports.work_main = work_ctrl.main;

var table_ctrl = require('../controllers/table');
exports.table_main = table_ctrl.main;
exports.create_table = table_ctrl.create;
exports.save_table = table_ctrl.save;
exports.delete_table = table_ctrl.delete;
exports.search_table = table_ctrl.search;

var user_ctrl = require('../controllers/user');
exports.set_engineering = user_ctrl.set_engineering_working;
//exports.offline = user_ctrl.offline;
exports.addFriend = user_ctrl.addFriend;
exports.verifyFriend = user_ctrl.verifyFriend;
exports.cancelVerifyFriend = user_ctrl.cancelVerifyFriend;

var chat_ctrl = require('../controllers/chat');
exports.chat_room = chat_ctrl.chat_room;

