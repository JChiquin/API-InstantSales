var mongoose = require("./Conexion")

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
	apellido:String,
	username:{type:String,
			required:"Usuario requerido"
			},
	pass: {type:String,
			minlength:[8,"Contraseña muy corta"],
			validate:pass_validator
		  },
	age:{type:Number,
		min:[18,"Debes ser mayor de edad"],
		max:[100,"Debes estar vivo"]
		},
	email: {type:String,
			required:"Email obligatorio",
			match: email_match
			},
	date_of_birth:Date,
	sex: {type:String,
		  enum: sex_enum
		 }

};

var user_schema = new Schema(userSchemaJSON);

user_schema.virtual("password_confirmation").get(function(){
	return this.p_c;
}).set(function(password){
	this.p_c=password;
});

var User = mongoose.model("User",user_schema);
module.exports=User;