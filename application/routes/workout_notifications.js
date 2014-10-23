var mongoose = require('mongoose');
var AppUser = require('../models/User');
var AppWorkout = require('../models/Workout');
var AppNotification = require('../models/WorkoutNotification');

var express = require('express');
var router = express.Router();
//Given a user_id, and a content for a notificaion, this request will populate
//user's work out notifications with a new Workout Notification object. Iff workout_id
//is not present in WorkoutNotification's workout attribute, then content of the 
//notification will be retrieved from the workout and a new notification will be created
//for the user. 

//We expect that this request will be called each time a user logs in, if one or more
//of his/her completed workouts is not recorded in Notifications. 
router.post('/postPendingWorkoutNotifications',function(req,res){
	//define new Workout Notification
	var WorkoutNotification = new AppNotification();

	//populate it using inputs and parameters
	WorkoutNotification.User = req.body.user_id;
	WorkoutNotification.Workout = req.body.workout_id;
	WorkoutNotification.Excercise_Points = 10;
	WorkoutNotification.Status = 'Pending';
	WorkoutNotification.Content = 'Waiting for content';
	WorkoutNotification.save(function(err){
		if(err)
			res.json(err)
	})
	AppWorkout.findById(req.body.workout_id, function(err, workout){
		WorkoutNotification.Content = 'You performed ' + workout.Activity + ' on ' + workout.Time;
		WorkoutNotification.save(function(err){
			if(err)
			res.json(err)
		})
	});


	//find the user for which this notification is being added
	AppUser.findById(req.body.user_id, function(err, user){
		if(err)
			res.send(err);
		//add notification id to user's pending notifications for workouts
		user.PendingWorkoutNotifications.push(WorkoutNotification._id);
		//save and output updated user
		user.save(function(err) {
      	if (err)
        	res.send(err);
      	res.json({success: true, Username: user.Username, Workout_notifications: user.PendingWorkoutNotifications, Current_Notification: WorkoutNotification._id});
    	});
	});
});

//This request will return all pending notifications for a particular user
router.post('/getPendingWorkoutNotifications',function(req,res){
	AppUser.findById(req.body.user_id, function(err, user){
		if (err){
			res.send(err);
			return;
		}
		res.json({success: true, Username: user.Username, All_Notifications: user.PendingWorkoutNotifications});
		return;
	});
});

//This request will return a partucular pending notification for a 
//particular user

router.post('/getPendingWorkoutNotification',function(req,res){
	AppUser.findById(req.body.user_id, function(err, user){
		if(err)
			res.send(err);
		AppNotification.findById(req.body.notification_id, function(err, notification){
			res.json({success: true, Username: user.Username, NotificationContent: notification.Content, NotificationStatus: notification.Status});
			return;
		})
	});
});

//When a user accepts a pending workout notification, its status will be set from
//true to false, indicating that a user indeed completed his/her workout task.
//When the user accepts the workout, his/her Activity Tracker increments by the
//amount of points pre-recorded as a reward for the task. If the user rejects the
//notification, then nothing changes - the application stops promting the user to
//deal with the notification, but no points are awarded.

router.post('/putPendingWorkoutNotification',function(req,res){
	//first retrieve user which edited notification status
	AppUser.findById(req.body.user_id, function(err, user){
		if(err)
			res.send(err);
		//find the notification which is being accepted or rejected
		AppNotification.findById(req.body.notification_id, function(err, notification){
			//change notification status
			notification.Status = req.body.Status;
			//save the notification status change
			notification.save(function(err){
				if(err)
					res.send(err)
			});
			//if the user accepted the notification, give stump points to the user
			if (req.body.Status === 'Accepted'){
				user.Stumps = user.Stumps + parseInt(notification.Excercise_Points);
				//save the user stump change
				user.save(function(err){
					if(err)
						res.send(err)
				});
			}

			res.json({success: true, Notification: notification, User: user.Username, Stumps: user.Stumps});

		});
	});
});

//This request is primarily for our use. Notifications should never be deleted in
//The application, as they are a method of record keeping (maintaining progress)
//However, for use of developers, we might need to delete notifications during
//the process of debugging

router.post('/deletePendingWorkoutNotification',function(req,res){
		//find the notification which is being accepted or rejected
	AppNotification.findByIdAndRemove(req.body.notification_id, function(err){
		if(err)
			res.send(err)
		res.json({ message: 'The notification has been removed'});
	});
});


module.exports = router;