var mongoose = require("mongoose");
var User = require("./User");

var Schema = mongoose.Schema;
var publicationSchemaJSON={
	name: String,
    description: String,
    location: String,
    contact: String,
    creationDate: {type: Date, default: Date.now},
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    photo: {type:String},
    price: Number,
    stock: Number,

};

var publication_schema = new Schema(publicationSchemaJSON,{strict:false});
module.exports = mongoose.model("Publication",publication_schema);