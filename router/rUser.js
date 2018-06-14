var express = require("express"),
		User = require("../models/User");

var router = express.Router();

router.route("/:id")
	.get(function(req,res){

	})
	.delete(function(req,res){

	})
	.put(function(req,res){

	});

router.route("/")
	.get(function(req,res){
		User.find()
		.then((docs) => {
      res.json(docs); 
    })
    .catch((err) => {
      console.log(err);
    });
	})
	.post(function(req,res){
		var user = new User({email:req.body.email,
						pass:req.body.pass,
						password_confirmation:req.body.password_confirmation,
						sex:req.body.sex,
						age:req.body.age,
						username:req.body.username,
						date_of_birth:req.body.date_of_birth,
						name:req.body.name,
						apellido:req.body.apellido
						});
		user.save()
		.then((u)=>{
			res.send(u);
		})
		.catch((err)=>{
			res.send(err.toString());
		});

	});

module.exports = router;