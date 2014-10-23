var express = require('express');
var router = express.Router();
var util = require('../public/javascripts/util.js');
var User = require('../models/User.js');
var mongoose = require('mongoose');
var Session = require('../models/Session.js');
var moment = require('moment');
var Post = require('../models/Post.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('diagnostics', { title: 'BeaverRun | Diagnostics' });
});

router.post('/CreateAccount',function(req,res){
	var potentialMatch;
	User.findOne({ Username: req.body.Username }, 
		function (err, potentialMatch) {
		    if (err) {
		        throw Error;
		    }
		    if(potentialMatch!=null){
		    	res.json({success:false, message:'Username '+ req.body.Username +' already exists'});
		    	return;
		    }
		    else{
		    	var newUser = new User();
				newUser.Username = req.body.Username;
				newUser.Email = req.body.Email;
				newUser.Groups = [];
				newUser.Stumps = 0;
				newUser.RecentPosts = [];
				newUser.Friends		= [];
				newUser.PendingRequests = [];
				newUser.Workouts = [];
				newUser.PendingFriendRequests = [];
				newUser.SentFriendRequests = [];
				newUser.PendingWorkoutNotifications = [];
				newUser.Password = util.GetHashedPassword(req.body.Password);

				newUser.save(function(err, newUser) {
				  if (err) {
				  	return console.error(err);
				  }
				  else{
				  	var currentSession = new Session();
				    	currentSession.Username = req.body.Username;
				    	currentSession.Expires = moment(Date.now()).add(1,'days').unix();
				    	currentSession.save(function (err, currentSession){
				    		if (err){
				    			return console.error(err);
				    		}
				    		res.json({success:true, sessionId:currentSession._id, message:'new User: '+newUser.Username});
				    		return;
				    	});
					}

				});
		    }	
		}
	);
});
router.post('/Login',function(req,res){
	var match;
	var enteredPassword = util.GetHashedPassword(req.body.Password);
	User.findOne({ Username: req.body.Username }, 
		function (err, match) {
		    if (err) {
		        throw Error;
		    }
		    if (match!=null){
		    	if (enteredPassword!=match.Password){
		    		res.json({success:false,message:'Incorrect Password'});
		    		return;
		    	}
		    	var currentSession = new Session();
		    	currentSession.Username = req.body.Username;
		    	currentSession.Expires = moment(Date.now()).add(1,'days');
		    	currentSession.save(function (err, currentSession){
		    		if (err){
		    			return console.error(err);
		    		}
		    		res.json({Username: match.Username, UserId: match._id, success:true, sessionId:currentSession._id, message: 'Login successful'});
		    		return;
		    	});
		    	
		    }
		    else{
				res.json({ success: false, message:'Username not recognized'});
				return;
			}
		});
	//res.json({success:false, errmsg:'Login problem'});
});
router.post('/GetUsers', function(req,res){
	User.find({},{Username:1}).exec(function(err,Users){
		return res.json({UserList:Users});
	})
})
router.post('/DeleteUser',function(req,res){
	console.log(req.body.Username);
	User.remove({Username:req.body.Username}).exec(function(err){
		if (err==null){
			return res.json({success:true, message:'Deleted: '+req.body.Username});
		}
	})
})
router.post('/PutUserPost', function(req,res){
	User
})
module.exports = router;
