var mongoose = require("mongoose");
var Publication = require("./Publication");

var Schema = mongoose.Schema;


var email_match=[/^\w+\@\w+\.\w+$/,"Coloca email valido"];
var sex_enum= {
	values:["M","F"],
	message:"Sexo no valido"
};
var pass_validator = {
	validator:function(p){
		return this.password_confirmation==p;
	},
	message:"Contraseñas deben coincidir"
};

var userSchemaJSON={
	name:String,
	username:{type:String,
			required:"Usuario requerido"
			},
	pass: {type:String,
			validate:pass_validator
		  },
	email: {type:String,
			required:"Email obligatorio",
			match: email_match
			},
	birthdate:Date,
	gender: {type:String,
		  enum: sex_enum
		 },
	phone: String,
	countPublications: { type: Number, default: 0, min : 0 },
	countFollowers: { type: Number, default: 0, min : 0 },
	countFollowing: { type: Number, default: 0, min : 0 },
	creationDate: { type: Date, default: Date.now},
	favorites: [{ type: Schema.Types.ObjectId, ref: 'Publication' }],
	buys: [{ type: Schema.Types.ObjectId, ref: 'Publication' }],
	profilePicture: { type:String, default: "assets/imgs/icon-user.png"},
	followers: [{ type: Schema.Types.ObjectId, ref: 'User' }], 
	following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
};

var user_schema = new Schema(userSchemaJSON, {strict:false});

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c=password;
});

var User = mongoose.model("User",user_schema);
module.exports=User;