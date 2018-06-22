let User = require("./models/User"),
	rUser = require("./routes/rUser"),
	cUser = require("./controllers/cUser"),
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
app.use("/app", authentication);
app.use("/api/user",rUser);
app.use("/api/publication",rPublication);

app.post("/login",cUser.login);
app.post("/addUser",cUser.addUser);

app.use((req,res)=>{
	res.status(404);
});


module.exports = app;