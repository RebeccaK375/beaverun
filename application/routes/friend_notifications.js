var mongoose = require('mongoose');
var AppUser = require('../models/User');
var FriendNotification = require('../models/FriendNotification')

//This request will be called when a user Makes a friend request
var express = require('express');
var router = express.Router();

router.post('/postFriendNotification',function(req,res){
	//define new friend request

	var newNotification = new FriendNotification();

	newNotification.From_User = req.body.from_user_id;
	newNotification.To_User = req.body.to_user_id;
	newNotification.Status = 'Pending';

	//find the user that the request is being sent to
	AppUser.findById(req.body.to_user_id, function(err, user){
		if(err)
			res.send(err);
		//add notification id to user's pending notifications for friends
		user.PendingFriendRequests.push(newNotification._id);
		//save and output updated user
		user.save(function(err) {
      	if (err)
        	res.send(err);
        res.json(newNotification);
    	});
	});

	//find the user who sent the friend request
	AppUser.findById(req.body.from_user_id, function(err, user){
		if(err)
			res.send(err);
		//add the new notification to his/her sent friend requests
		user.SentFriendRequests.push(newNotification._id);
		//save and output updated user
		user.save(function(err) {
      	if (err)
        	res.send(err);
    	});
	});
});


router.post('/putFriendNotification',function(req,res){
	var Action = req.body.action;
	FriendNotification.findById(req.body.friend_notification_id, function(err, notification){
		if (Action == 'Deny'){
			notification.Status = 'Denied';
			notification.save(function(err){
				if(err)
					res.send(err);
			})

			AppUser.findById(notification.to_user_id, function(err, user_who_denied){
				user_who_denied.PendingFriendRequests.findByIdAndRemove(notification._id, function(err){
					if(err)
						res.send(err)
					res.json({ message: 'The friend request has been removed'});
				});

			});

		}else{
			//The notification has been accepted
			notification.Status = 'Accepted';
			//Change status and save the notification
			notification.save(function(err){
				if(err)
					res.send(err);
			})
			//for the user who accepted the request, remove the pending friend request
			AppUser.findById(notification.to_user_id, function(err, user_who_accepted){
				//Access the friend request in question from user's requests
				//and remove the current request from the list of pending requests
				user_who_accepted.PendingFriendRequests.findByIdAndRemove(notification._id, function(err){
					if(err)
						//make sure there is no error
						res.send(err)
					res.json({ message: 'The friend request notification has been removed'});
				});

				//for the user who accepted the request, we need to add the user who proposed friendship to Friends' List
				user_who_accepted.Friends.push(notification.from_user_id);
				//after we add the friend, we save the user to keep changes
				user_who_accepted.save(function(err){
					if(err)
						res.send(err);
				})
			});

			AppUser.findById(notification.to_user_id, function(err, user_who_offered){
				//Access the friend request in question from user's requests
				//and remove the current request from the list of pending requests
				user_who_offered.SentFriendRequests.findByIdAndRemove(notification._id, function(err){
					if(err)
						//make sure there is no error
						res.send(err)
					res.json({ message: 'The sent friend request notification has been removed'});
				});

				//for the user who accepted the request, we need to add the user who proposed friendship to Friends' List
				user_who_offered.Friends.push(notification.to_user_id);
				//after we add the friend, we save the user to keep changes
				user_who_offered.save(function(err){
					if(err)
						res.send(err);
				})
			});

		}
	});
});

module.exports = router;