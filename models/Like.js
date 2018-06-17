var mongoose = require("mongoose");
var User = require("./User");

var Schema = mongoose.Schema;
var likeSchemaJSON={
    creationDate: {type: Date, default: Date.now},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    userPublicationId: {type: Schema.Types.ObjectId, ref: 'User'},
    publicationId: {type: Schema.Types.ObjectId, ref: 'Publication'},
    viewed: {type: Boolean, default: false}
};

var like_schema = new Schema(likeSchemaJSON, {strict:false});
module.exports = mongoose.model("Like",like_schema);