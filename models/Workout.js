var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var workoutSchema = new Schema({
	Activity: String,
	Time: Number,
	Type: Boolean,
	Location: String,
	SkillLevel: Number,
	Users_Attending: [ObjectId],
	Upcoming: Boolean,
	IsGroup: Boolean
});
module.exports = mongoose.model('Workout',workoutSchema);