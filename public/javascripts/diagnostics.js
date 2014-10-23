var PageInfo = {
	LoggedInUsername: null,
	LoggedInUserId: null,
	SessionId: null,
	UserStumps: null,
	UserWorkouts: null
};
$(document).ready(function() {
	console.log('hello World');
	$("#createAccount").click(function(){
		var username = $("#CreateUsername").val();
		var email = $("#CreateEmail").val();
		var password = $("#CreatePassword").val();
		$.post('/CreateAccount', {Username: username, Email: email, Password:password},
			function (data){
				console.log(data);
				$("#createMessage").html(data.message);
			});
	});
	$("#login").click(function(){
		var username = $("#LoginUsername").val();
		var password = $("#LoginPassword").val();
		console.log(username);
		console.log(password)
		$.post('/Login', { Username:username, Password:password},
			function (data){
				$("#loginMessage").html(data.message+ '<br/> Username: '+data.Username+'<br/> UserId: '+data.UserId+'<br/> SessionId: '+data.sessionId);
				PageInfo.SessionId = data.sessionId;
				PageInfo.LoggedInUsername = data.Username;
				PageInfo.LoggedInUserId = data.UserId;
			});
	});
	$("#getUsers").click(function(){
		$.post('/getUsers', {},function(data){
			var htmlString = ''
			console.log(data);
			for(var i=0;i<data.UserList.length;i++){
				htmlString+= data.UserList[i].Username+ ' with ID: ' + data.UserList[i]._id + '<br />'
			}
			$("#userListing").html(htmlString);
		})
	});
	$('#deleteUser').click(function(){
		userToDelete = $("#DeleteUsername").val();
		console.log(userToDelete);
		$.post('/deleteUser',{Username: userToDelete}, function(data){
			if (data.success){
				$("#deleteMessage").html(data.message);
			}
		})
	});
	$("#addStumps").click(function(){
		var Username = $("#StumpsUsername").val();
		var stumps = $("#StumpsVal").val();
		console.log(PageInfo.SessionId);
		$.post('/workout/AddStumps',{Username:Username, Session:PageInfo.SessionId, Stumps:stumps}, function(data){
			console.log(data);
			$("#stumpsMessage").html(data.UpdatedUser+" stumps: "+data.NewStumps);
		})
	})


	$("#addWorkout").click( function(){
		var author = $("#WorkoutAuthor").val();
		var activity = $("#WorkoutName").val();
		var time = $("#WorkoutTime").val();
		var location = $("#WorkoutLocation").val();
		var type = $("#WorkoutType").val();
		var skill = $("#WorkoutLevel").val();
		var group = $("#WorkoutGroup").val();

		console.log("Adding a workout...")
		$.post('/workout/AddWorkout' , {Username:author, Session:PageInfo.SessionId, Activity:activity, Time:time, Type: type, Location: location, SkillLevel: skill, IsGroup: group}, function(data){
				console.log("Added a workout!");
				console.log(data.Workout_All);
				$("#workoutMessage").html(data.UserAuthor + ' added: ' + data.Workout + ' to current workouts!')
		})
	});

	$("#addUserToWorkout").click( function(){
		var WorkoutID = $("#WorkoutID").val();
		var UserName = $("#UserToWorkoutName").val();

		console.log("Adding the user to the workout...")
		$.post('/workout/AddUserToWorkout' , {Username:UserName, Session:PageInfo.SessionId, workout_id: WorkoutID}, function(data){
				console.log("Added a user to workout!");
				console.log(data.Workout);

				var htmlString = ''
				for(var i=0;i<data.UserList.length;i++){
					htmlString+= data.UserList[i]+'<br />'
					}
				$("#userToWorkoutMessage").html(data.User + ' was added, IDs in workout list are now: ' + htmlString)
		})
	});

	$("#removeWorkouts").click( function(){
		var TimeNow = $("#TimeNow").val();
		$.post('/workout/RemovePastWorkouts' , {Time_Now: TimeNow}, function(data){
			console.log("Checked all workouts!");
			var htmlString = ''
			for(var i=0;i<data.current_workouts.length;i++){
				htmlString+= '<br />' + 'Activity:' + data.current_workouts[i].Activity+ 'at time: ' + data.current_workouts[i].Time + '<br />'
			}
			$("#removeWorkoutsMessage").html('Removed ' + data.number_removed + ' workouts.' + data.number_workouts + ' workouts prior to removal.' + ' Following workouts left:' + htmlString)
		})
	});


	$("#getWorkouts").click(function(){
		$.post('/workout/getWorkouts', {},function(data){
			var htmlString = ''
			for(var i=0;i<data.Workouts.length;i++){
				var userString = ''
				for(var j=0; j<data.Workouts[i].Users_Attending.length; j++){
					userString+= data.Workouts[i].Users_Attending[j] + ', '
				}
				htmlString+= '<br />' + data.Workouts[i].Activity + ' with workoutID: ' + data.Workouts[i]._id + ' at Time: ' + data.Workouts[i].Time + '. IDs of Users Attending: ' + userString + '<br />'
			}
			$("#getWorkoutsMessage").html(htmlString);
		})
	});

	$("#addGroup").click( function(){
		var username = $("#AddGroupUsername").val();
		var groupName = $("#Groupname").val();
		var descr = $("#GroupDescription").val();
		console.log(username);
		console.log("Adding a group...")
		$.post('/groups/CreateGroup' , {Username:username, Session:PageInfo.SessionId, Groupname:groupName, GroupDescription:descr}, function(data){
			if(data.success){
				console.log("Added a group!")
				$("addGroupMessage").html(data.message)
			} else {
				$("#addGroupMessage").html( '<br/> failed!');
			}
		})
	});


	$("#deleteGroup").click( function(){
		var username = $("#DelGroupUsername").val();
		var groupName = $("#Groupname").val();
		$.post('/groups/RemoveGroup' , {Username:username, Session:PageInfo.SessionId, Groupname:groupName}, function(data){
			if(data.success){
				console.log("Removed a group!")
				$("#deleteGroupMessage").html(data.message)
			}
		})
	});
	$("#addWorkoutNotification").click( function(){
		var User_id = $("#User_Id").val();
		var Workout_id = $("#Workout_Id").val();
		console.log("Adding workout notification to user...")
		$.post('/workout_notifications/postPendingWorkoutNotifications' , {user_id:User_id, workout_id:Workout_id}, function(data){
			if(data.success){
				var htmlString = ''
				for(var i=0; i<data.Workout_notifications.length; i++){
					htmlString+= '<br/>' + data.Workout_notifications[i]
				}
				console.log("Added a notification!!")
				$("#addWorkoutNotificationMessage").html(data.Username + ' received notification ID: ' + data.Current_Notification + '. All notifications IDs for this user are listed below: ' + htmlString)
			}
		})
	});


	$("#getWorkoutNotifications").click( function(){
		var User_id = $("#User_Id_WK").val();
		console.log("Getting workout notification from user...")
		$.post('/workout_notifications/getPendingWorkoutNotifications' , {user_id:User_id}, function(data){
			if(data.success){
				var htmlString = ''
				for(var i=0; i<data.All_Notifications.length; i++){
					htmlString+= '<br/>' + data.All_Notifications[i]
				}
				console.log("Got notifications!")
				$("#getWorkoutNotificationsMessage").html('User ' + data.Username + ' has notifications with IDs: ' + htmlString)
			}
		})
	});


	$("#getWorkoutNotification").click( function(){
		var User_id = $("#User_Id_WK_One").val();
		var WorkoutNotification_id = $("#Workout_Id_WK_One").val();
		console.log("Getting workout notification from user...")
		$.post('/workout_notifications/getPendingWorkoutNotification' , {user_id:User_id, notification_id: WorkoutNotification_id}, function(data){
			if(data.success){
				console.log("Got notification!")
				$("#getWorkoutNotificationMessage").html('User ' + data.Username + ' has notifications with Content: ' + data.NotificationContent + ' and Status: ' + data.NotificationStatus)
			}
		})
	});


	$("#respondWorkoutNotification").click( function(){
		var User_id = $("#User_Id_Responding").val();
		var WorkoutNotification_id = $("#Notification_Id_Responding").val();
		var NewStatus = $("#Notification_Response").val();
		console.log("Updating user's notification...")
		$.post('/workout_notifications/putPendingWorkoutNotification' , {user_id:User_id, notification_id: WorkoutNotification_id, Status: NewStatus}, function(data){
			if(data.success){
				console.log("Updated! notification!")
				$("#respondWorkoutNotificationMessage").html('User ' + data.User + ' responded to notification : ' + data.Notification._id + ' and ' + data.Notification.Status + '. Stumps of user now: ' + data.Stumps)
			}
		})
	});



})