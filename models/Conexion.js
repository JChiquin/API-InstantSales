var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/fotos");

module.exports=mongoose;