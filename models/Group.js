var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

// Author: David Danko

var groupSchema = new Schema({
Groupname	: String,
Description	: String,
Users		: [ObjectId],
Workouts	: [ObjectId],
Posts		: [ObjectId]
});
module.exports = mongoose.model('Group', groupSchema);
