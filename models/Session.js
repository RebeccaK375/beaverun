var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var sessionSchema = new Schema({
Username     : String,
Epires: Number,
});
module.exports = mongoose.model('Session',sessionSchema);