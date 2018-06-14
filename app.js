let User = require("./models/User"),
	rUser = require("./router/rUser"),
	authentication = require("./middlewares/authentication");

let express = require("express"),
	bodyParser = require("body-parser"),
	cors = require('cors'),
	jwt = require('jwt-simple');

let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

/*app.use(session({
	secret:"sauhd8923ye",
	resave: false,
	saveUninitialized:false
}));*/

app.use("/app", authentication);
app.use("/app/user",rUser);

app.post("/login",function (req,res){
	User.findOne({email:req.body.email, pass:req.body.pass},function(err,user){
		if(user){
			let accessToken = jwt.encode(user, secret);
			res.json({
				accessToken,
			});
		}else
			res.send("Datos incorrectos");
	});
});

app.listen(80, () => {
  console.log("Servicio inicializado, escuchando en puerto 80")
});