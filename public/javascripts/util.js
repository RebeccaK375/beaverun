var hashmult = 6782;
var hashshift = 82834;
var Session = require('../../models/Session.js')
var moment = require('moment');
module.exports={
	GetHashedPassword: function(password)
	{
		var newPassword='';
		for(var i=0;i<password.length;i++)
		{
			newPassword+=(password.charCodeAt(i)+100).toString();
		}
		var intPassword = parseInt(newPassword);
		finalPassword = ((intPassword*hashmult)+hashshift).toString();
		return newPassword;
	},
	CheckSessionValidity: function(username, sessionId, f){
		var currentSession;
		console.log('session: ' +sessionId)
		Session.findOne({ _id: sessionId }, 
			function (err, currentSession) {
			    if (err) {
			        throw Error;
			    }
			    if(currentSession!=null){
			    	if(moment(Date.now()).isAfter(moment(currentSession.Expires)) || currentSession.Username!=username)
			    	{
			    		return f(false);
			    	}
			    	else{
			    		return f(true);
			    	}
			    	
			    }
			    return f(false);
			}
		);
	},
	ExtractAts : function(freet){
		var ats= [];
		for(var i=0;i<freet.length;i++){
			if (freet.charAt(i)=='@'){
				var username = '';
				i++;
				while(freet.charAt(i)!=' ' && i<freet.length){
					username+=freet.charAt(i);
					i++;
				}
				ats.push(username);
			}
		}
		return ats;
	},
	ExtractTags : function(freet){
		var tags= [];
		for(var i=0;i<freet.length;i++){
			if (freet.charAt(i)=='#'){
				var tag = '';
				i++;
				while(freet.charAt(i)!=' '&&i<freet.length){
					tag+=freet.charAt(i);
					i++;
				}
				tags.push(tag);
			}
		}
		return tags;
	}
}