var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;
var postSchema = new Schema({
Author : ObjectId,
Messsage : String,
DirectedAt: ObjectId
});
module.exports = mongoose.model('Post',postSchema);
