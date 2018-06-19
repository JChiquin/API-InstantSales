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
app.use(express.static('public'));

//rutas
//app.use("/app", authentication);
app.use("/api/user",rUser);
app.use("/api/publication",rPublication);

app.post("/login",function (req,res){
	console.log(req.body);
	User.findOne({username:req.body.username, password:req.body.password},(err,user)=>{
		if(err)
			res.status(500).json(err);
		else if(user){
			let accessToken = jwt.encode(user, secret);
			res.status(200).json({status:true, items:user, accessToken });
		}else{
			res.status(401).json({status:false,message: "Datos incorrectos"});
		}
	});
});

app.use((req,res)=>{
	res.status(404);
});


module.exports = app;