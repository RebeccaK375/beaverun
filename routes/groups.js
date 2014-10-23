var express = require('express');
var router = express.Router();
var util = require('../public/javascripts/util.js');
var User = require('../models/User.js');
var mongoose = require('mongoose');
var Session = require('../models/Session.js');
var moment = require('moment');
var Post = require('../models/Post.js');
var Group = require('../models/Group.js');

// Author: David Danko


/* Allows a given user to join a group */
router.post('/JoinGroup', function(req,res){
	util.CheckSessionValidity(req.body.Username,req.body.Session,function(success){
		if(success){
			var groupName = req.body.Groupname
			var userName = req.body.Username
			
			Group.findOne({Groupname: groupName}, function(err,group){
				if(err){
					res.json({success:false, error:err});
					return;
				} else if( group){

					User.findOne({Username: userName}, function(err,user){

						if(err){
							res.json({success:false, error:err});
							return;
						} 

						user.Groups.push(group._id)
						user.save( function(err){
							if(err){
								res.json({success:false, error:err});
								return;
							}
						})

						group.Users.push( user._id)
						group.save( function(err){
							if(err){
								res.json({success:false, error:err});
								return;
							}
						})
						res.json({success:true, Group:group, User:user})
					})
				}
			})
		}
	})
});

/* Allows a user to leave a group */
router.post('/LeaveGroup', function(req,res){
	util.CheckSessionValidity(req.body.Username,req.body.Session,function(success){
		if( success){
			var groupName = req.body.joinGroupName
			var userName = req.body.Username

			Group.findOne({Groupname: groupName}, function(err,group){
				if(err){
					res.json({success:false, error:err});
					return;
				} else if( group){
					User.findOne({Username: userName}, function(err,user){

						var groupIndex = user.Groups.indexOf(group._id)
						if(groupIndex > -1){
							users.Groups.splice(groupIndex,1);
						}
						user.save( function(err){
							if(err){
								res.json({success:false, error:err});
								return;
							}
						})

						var userIndex = group.Users.indexOf(group._id)
						if(userIndex > -1){
							group.Users.splice(userIndex,1);
						}
						group.save( function(err){
							if(err){
								res.json({success:false, error:err});
								return;
							}
						})
						res.json({success:true, Group:group, User:user})
					})
				}
			})
		}
	})
});

/* Get a list of all the groups */
router.get('/ListGroups', function(req,res){
	Group.find({}).exec(function(err, groups){
		if (err==null){
			res.json({success:true,allGroups:groups});
			return;
		}
		res.json({success:false, error:err});
	})
});

/* Creeate a new group */
router.post('/CreateGroup', function(req,res){

	util.CheckSessionValidity(req.body.Username,req.body.Session,function(success){
		if( success){
			var userName = req.body.Username
			User.findOne({Username: userName}, function(err,creator){
				if(err){
					res.json({success:false, error:err});
					return;
				}
				newGroup = new Group();
				newGroup.Groupname = req.body.Groupname;
				newGroup.Description = req.body.GroupDescription;
				newGroup.Users = [creator._id];
				newGroup.Workouts = [];
				newGroup.Posts = [];
				newGroup.save( function(err){
					if(err == null){
						res.json({success:true, Group:newGroup})
					} else {
						res.json({success:false, error:err});
						return;
					}
				})
			})
		}
	})
});

/* Edit a group */
router.post('/EditGroup', function(req,res){
	util.CheckSessionValidity(req.body.Username,req.body.Session,function(success){
		if(success){
			var userName = req.body.Username
			var groupName = req.body.joinGroupName
			Group.findOne({Groupname: groupName}, function(err,group){
				User.findOne({Username: userName}, function(err,user){

					if( !err && -1 < group.Users.indexOf(user._id)){
						group.Groupname = req.body.Groupname;
						group.Description = req.body.GroupDescription;
						group.Users = req.body.GroupUsers
						group.Workouts = req.body.GroupWorkouts
						group.Posts = req.body.GroupPosts
						group.save( function(err){
							if(err == null){
								res.json({success:true, Group:group})
							} else {
								res.json({success:false, error:err});
								return;
							}
						})
					} else {
						res.json({success:false, error:err});
						return;
					}
				})
			})
		}
	})
});

/* Delete a group */
router.post('/RemoveGroup', function(req,res){
	util.CheckSessionValidity(req.body.Username,req.body.Session,function(success){
		if(success){
			var userName = req.body.Username
			var groupName = req.body.Groupname
			User.findOne({Username: userName}, function(err,user){
				if( err){
					res.json({success:false, error:err});
					return;
				}
				Group.findOne({Groupname: groupName}, function(err,group){
					if( err){
						res.json({success:false, error:err});
						return;
					}
					if(-1 < group.Users.indexOf(user._id)){// if user in group
						Group.remove({_id:group._id}).exec( function(err){
							if( err){
								res.json({success:false, error:err});
								return;
							} else {
								res.json({success:true});
								return;
							}
						})
					}
				})
			})
		}
	})
});






module.exports = router;

