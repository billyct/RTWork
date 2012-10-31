//for signin
// focus on first field in form
$("input[type='text']:first", document.forms[0]).focus();

var username = new LiveValidation('username');
username.add(Validate.Presence);

var password = new LiveValidation('password');
password.add(Validate.Presence);

var loginOnSubmit = username.form.onsubmit;

$('#wrapper > #login_box #signin_button').live('click', function() {
	var valid = loginOnSubmit();
	if (!valid) {
		return false;
	}else{
		//var socket = io.connect(sockets.url);
		var username = $('#username').val();
		var password = $('#password').val();
		
		$.post('/signin', 
				{
					username:username,
					password:password	
				},function(data){
					if(data.success == 'failed'){
						alert(data.message);
						return false;	
					}else if(data.success == 'success'){
						alert(data.message);
						location.href = '/'; 
						// $.get('/site/slidebar', function(data){
							// $('#wrapper > #login_box').remove();
							// $('#wrapper').append(data);
						// });
					}
				}
		);
	}
	
	return false;
});

$('#wrapper > #login_box #bar #signup_button').click(function(){
	if (!$('#wrapper > #signup_box')[0]) {
		$.get('/signup', function(data){
			$('#wrapper > #login_box').fadeOut('slow');
			$('#wrapper').append(data);
			signupFunctions();
		});
	}else{
		$('#wrapper > #login_box').fadeOut('slow');
		$('#wrapper > #signup_box').fadeIn('slow');
	}
});


//for signup
//$("#reg_username", "#engineering_name").focus();

var signupFunctions = function(){
	if ($('#wrapper > #signup_box')[0]) {
		var reg_username = new LiveValidation('reg_username');
		reg_username.add(Validate.Presence);

		var reg_email = new LiveValidation('reg_email');
		reg_email.add(Validate.Presence);
		reg_email.add(Validate.Email);

		var reg_password = new LiveValidation('reg_password');
		reg_password.add(Validate.Presence);

		var reg_password_confirmed = new LiveValidation('reg_password_confirmed');
		reg_password_confirmed.add(Validate.Presence);
		reg_password_confirmed.add(Validate.Confirmation, {match: 'reg_password'});

		var engineering_name = new LiveValidation('engineering_name');
		engineering_name.add(Validate.Presence);

		var regOnSubmit = reg_username.form.onsubmit;
		var engineeringOnSubmit = engineering_name.form.onsubmit;

		//a test code
		$('.wizard_steps ul li a').click(function() {
			// $('.wizard_steps ul li').removeClass('current');
			// $(this).parent('li').addClass('current');

			// var step = $(this).attr('href');
			// var step_num = $(this).attr('href').replace('#step_', '');
			// var step_multiplyby = (100 / $(".wizard_steps > ul > li").size());
			// var prog_val = (step_num * step_multiplyby);

			// $("#progressbar").progressbar({
			// 	value : prog_val
			// });

			// $('.wizard_content').children().hide();
			// $('.wizard_content').children(step).fadeIn();

			return false;
		});

		$('button.next_step').click(function() {
			
			var step = $(this).attr('id');
			var hash_step = ('#' + step);

			var step_num = $(this).attr('id').replace('step_', '');
			
			if (step_num == 2){
				//注册页
				var valid = regOnSubmit();
				if (!valid) {
					return false;
				}else{
					var username = $('#reg_username').val();
					var email = $('#reg_email').val();
					var password = $('#reg_password').val();
					$.post('/signup', 
							{
								username:username,
								email:email,
								password:password	
							},function(data){
								if(data.success == 'failed'){
									alert(data.name+'注册失败'+data.message);
									return false;	
								}else if(data.success == 'success'){
									alert(data.name+'注册成功'+data.message);
								}
							}
					);
				}
			}
			
			if (step_num == 3){
				//创建一个工程页
				var valid = engineeringOnSubmit();
				if (!valid) {
					return false;
				}else{
					var engineering_name = $('#engineering_name').val();
					console.log(engineering_name);
					$.post('/engineering/create', {engineering_name: engineering_name}, function(data){
						if(data.success == 'failed'){
							alert(data.message);
							return false;	
						}else if(data.success == 'success'){
							//alert(data.message);
							$.post('user/set_engineering', {
								engineering_working_name: engineering_name
							}, function(data){
								if (data.success == 'failed') {
									alert(data.message);
									return false;
								}
							});
							
						}
						
					});
				}
			}
			if (step_num == 'finish'){
				location.href = '/';
			}
			
			var step_multiplyby = (100 / $(".wizard_steps > ul > li").size());
			var prog_val = (step_num * step_multiplyby);

			$("#progressbar").progressbar({
				value : prog_val
			});

			$('.wizard_steps ul li').removeClass('current');
			$('a[href=' + hash_step + ']').parent().addClass('current');

			$('.wizard_content').children().hide();
			$('.wizard_content').children(hash_step).fadeIn();

			return false;
		});

		$('#signup_box button#cancel').live('click', function(event) {
			$('#wrapper > #signup_box').fadeOut("slow");
			$('#wrapper > #login_box').fadeIn("slow");
			
			return false;
		});
		$('#main_container').css("background", "none");
		$('#main_container').css('margin-left', '250px');
	}
}


