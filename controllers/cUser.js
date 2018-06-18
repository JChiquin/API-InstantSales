var	Publication = require("../models/Publication"),
	Like = require("../models/Like"),
	mongoose = require("mongoose"),
	User = require("../models/User");

function getUser(req,res){
	let users = req.body.user;
	User.findById(users.idString, (err,user)=>{
		if(err)
			res.status(500).json(err);
		else if (!user)
			res.status(404).json({message:"User not found"});
		else{
			User.findOne({_id:users.idStringLogged,following:user._id}, '_id',(err,doc)=>{
				console.log(doc);
				if(err)
					res.status(500).json(err);
				else{
					user.set({isFollowed : !!doc})				
					res.status(200).json({status:true,items:user});
				}
			})
		}
	})
}

function getUsers(req,res){
	User.find((err,users)=>{
		res.json({status:true,items:users});
	})
}

function getUserByUsername(req,res){
	User.findOne({username:req.body.username},'_id',(err,user)=>{
		if(err)
			res.status(500).json(err);
		else if (!user){
			res.status(404).json({status:false, message: "No items were found"})
		}else{
			user.set({isFollowed : true});
			res.status(200).json({status:true,items:true});
		}

	})

}

module.exports = {
	getUser,
	getUsers
}
