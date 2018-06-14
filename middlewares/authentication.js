let User = require("../models/User");
let jwt = require('jwt-simple');

let secret = '712386210123';

module.exports = (req,res,next) => {
	const accessToken = req.get('accessToken');
	if(accessToken){
		let user = jwt.decode(accessToken, secret);
		User.findById(user._id, function(err, user){
			if(user)
				next();
			else
				res.sendStatus(401);
		});
	} else
	res.sendStatus(401);
}