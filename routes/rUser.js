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
		console.log(req.body);
		var user = new User(req.body);
		user.save()
		.then((u)=>{
			res.status(200).json(u);
		})
		.catch((err)=>{
			res.status(500).json(err);
		});

	});

module.exports = router;