var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var userSchema = new Schema({
Username     : String, 
Email		: String,
Stumps		: Number,
Groups		: [ObjectId],
RecentPosts : [ObjectId],
Friends		: [ObjectId],
PendingRequests : [ObjectId],
Workouts:[ObjectId],
Password      : String,
PendingFriendRequests: [ObjectId],
SentFriendRequests: [ObjectId],
PendingWorkoutNotifications: [ObjectId],
});
module.exports = mongoose.model('User',userSchema);
