var express = require('express');
var router = express.Router();
var util = require('../public/javascripts/util.js');
var User = require('../models/User.js');
var mongoose = require('mongoose');
var Session = require('../models/Session.js');
var moment = require('moment');
var Post = require('../models/Post.js');
var Workout = require('../models/Workout.js')

router.post('/AddStumps', function(req,res){
	util.CheckSessionValidity(req.body.Username,req.body.Session,function(success){
		if (success){
			User.findOne({Username : req.body.Username}).exec(function(err, CurrentUser){
				if (err==null){
					CurrentUser.Stumps = CurrentUser.Stumps + parseInt(req.body.Stumps);
					CurrentUser.save(function (error){
						if (error){
							res.json({success:false, error:err});
							return;
						}
						else{
							res.json({success:true, UpdatedUser : CurrentUser.Username, NewStumps : CurrentUser.Stumps});
							return;
						}
					})
				}

			})
		}
	});
});

router.post('/GetWorkouts',function(req,res){
	Workout.find().exec(function(err, Workouts){
		if (err){
			res.json({success:false, error:err});
			return;
		}
		res.json({success:true,Workouts:Workouts});
		return;
	})
})


router.post('/AddWorkout',function(req,res){
	util.CheckSessionValidity(req.body.Username, req.body.Session, function(success){
		if(success){
			newWorkout = new Workout();
			newWorkout.Activity = req.body.Activity;
			newWorkout.Time = req.body.Time;
			newWorkout.Type = req.body.Type;
			newWorkout.Location = req.body.Location;
			newWorkout.SkillLevel = req.body.SkillLevel;
			newWorkout.Users_Attending = [];
			//Change - Now You Only add the author when workout is created
			// Other users simply join the workout after its creation
			newWorkout.Upcoming = true;
			newWorkout.IsGroup = req.body.IsGroup;
			newWorkout.save(function(err){
				if (err){
					res.json({success:false, error:err});
					return;
				}
			})

			User.findOne({Username : req.body.Username}).exec(function(err, CurrentUser){
				CurrentUser.Workouts.push(newWorkout._id);
				CurrentUser.save(function(err){});
				newWorkout.Users_Attending.push(CurrentUser._id);
				newWorkout.save(function(err){
					if (err){
						res.json({success:false, error:err});
						return;
					} else{
						res.json({success:true, Workout_All: newWorkout, UserAuthor: CurrentUser.Username, Workout:newWorkout.Activity});
						return;
					}
				})
			})

		}
	})
})

router.post('/AddUserToWorkout',function(req,res){
	util.CheckSessionValidity(req.body.Username, req.body.Session, function(success){
		if(success){

			Workout.findById(req.body.workout_id, function(err, workout){
				User.findOne({Username : req.body.Username}).exec(function(err, CurrentUser){
					CurrentUser.Workouts.push(workout._id);
					CurrentUser.save(function(err){
						if(err){
							res.json({success:false, error:err});
							return;
						}
						workout.Users_Attending.push(CurrentUser._id);
						workout.save(function(err){
							if(err){
								res.json({success:false, error:err})
								return;
							}
							else{
								res.json({success:true, Workout: workout, User: CurrentUser.Username, UserList: workout.Users_Attending});
							}

						})
					})
				})
			})
		}
	})
})


router.post('/RemovePastWorkouts',function(req,res){
	k = 0;
	Workout.find().exec(function(err,allWorkouts){
		if (allWorkouts){
			for (var i = 0; i < allWorkouts.length; i++) { 
				if (allWorkouts[i].Time < parseInt(req.body.Time_Now)){
					Workout.remove({_id:allWorkouts[i]._id}).exec(function(error){
						k = parseInt(k) + 1;
						if (error){
							res.json({success:false, error:error});
							return;
						}
					})
				}
			}
			Workout.find().exec(function(err, currentWorkouts){
				if(err){
					res.json(err)
				}

				res.json({success:true, number_workouts: i, number_removed: k, current_workouts: currentWorkouts});
				return;

			})
		}
		else{
			res.json({success:false, error:'No past workouts to delete'});
			return;
		}
	})
})

module.exports = router;