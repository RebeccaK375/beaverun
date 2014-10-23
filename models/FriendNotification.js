var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var FriendNotificationSchema = new Schema({
	From_User: ObjectId,
	To_User: ObjectId,
	Status: String
});

module.exports = mongoose.model('FriendNotification',FriendNotificationSchema);
