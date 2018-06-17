let User = require("./models/User"),
	rUser = require("./routes/rUser"),
	rPublication = require("./routes/rPublication"),
	authentication = require("./middlewares/authentication");

let express = require("express"),
	bodyParser = require("body-parser"),
	cors = require('cors'),
	jwt = require('jwt-simple');

let secret = '712386210123';
let app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//rutas
//app.use("/app", authentication);
app.use("/api/user",rUser);
app.use("/api/publication",rPublication);

app.post("/login",function (req,res){
	console.log(req.body);
	User.findOne({email:req.body.email, pass:req.body.pass},function(err,user){
		if(user){
			let accessToken = jwt.encode(user, secret);
			res.status(200).json({
				accessToken,
			});
		}else
			res.send("Datos incorrectos");
	});
});


module.exports = app;