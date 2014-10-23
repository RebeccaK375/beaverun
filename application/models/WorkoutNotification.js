var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var workoutNotificationSchema = new Schema({
	User: ObjectId,
	Workout: ObjectId,
	Content: String,
	Excercise_Points: Number,
	Status: String
});
module.exports = mongoose.model('WorkoutNotification',workoutNotificationSchema);
