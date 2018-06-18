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

function getUserByEmail(req,res){
	User.findOne({email:req.body.email},'_id',(err,user)=>{
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


function addUser(req,res) {
	var user = new User({email:req.body.user.email,
						password:req.body.user.password,
						passwordconfirm:req.body.user.passwordconfirm,
						username:req.body.user.username,
						name:req.body.user.name,
						});
	user.save()
	.then((u)=>{
		res.status(200).json({status:true,items:u});
	})
	.catch((err)=>{
		res.status(500).json(err);
	});
}

function updateUser(req,res){
	let user = req.body.user;
	User.findByIdAndUpdate(user._id,user,(err, userUpdate)=>{
		if(err)
			res.status(500).json(err);
		else
			res.status(200).json({status:true,items:userUpdate});			
	})
}

function updateUserPhotoProfile(req,res){

}

//MODIFICAR EL PROVIDER
function getFriends(req,res){
	let users=req.body.users;
	if(req.body.type=="Followers"){
		User.findById(users.idString,'-_id followers')
		.populate({path:'followers'})
		.exec((err,user)=>{
			if(err)
				res.status(500).json(err);
			else if (!user)
				res.status(404).json({status:false, message: "No items were found"});
			else
				user.followers.forEach(u=>{
					u.set({ isFollowed : u.following.indexOf(mongoose.Types.ObjectId(users.idStringLogged))!=-1})
				});
				res.status(200).json({status:true,items:user.followers});
		})
	}else{ //Following
		User.findById(users.idString,'-_id following')
		.populate({path:'following'})
		.exec((err,user)=>{
			if(err)
				res.status(500).json(err);
			else if (!user)
				res.status(404).json({status:false, message: "No items were found"});
			else
				user.following.forEach(u=>{
					u.set({ isFollowed : u.followers.indexOf(mongoose.Types.ObjectId(users.idStringLogged))!=-1})
				});
				res.status(200).json({status:true,items:user.following});
		})
	}
}

function addFollower(req,res){
	let follower = req.body.follower;
	User.findByIdAndUpdate(follower.followerId,
		{$addToSet:{following:follower.followedId}}, (err,userUpdate)=>{
			if(err)
				res.status(500).json(err);
			else
				User.findByIdAndUpdate(follower.followedId,
				{$addToSet:{followers:follower.followerId}},(err2,userUpdate2)=>{
					if(err2)
						res.status(500).json(err2);
					else
						res.status(200).json({ status:true });
				})
			})
}

function deleteFollower(req,res){
	let follower = req.body.follower;
	User.findByIdAndUpdate(follower.followerId,
		{$pull:{following:follower.followedId}}, (err,userUpdate)=>{
			if(err)
				res.status(500).json(err);
			else
				User.findByIdAndUpdate(follower.followedId,
				{$pull:{followers:follower.followerId}},(err2,userUpdate2)=>{
					if(err2)
						res.status(500).json(err2);
					else
						res.status(200).json({ status:true });
				})
			})
}

function getLikesUser(req,res){
	Likes.find({userId:req.body.idString},(err,likes)=>{
		console.log(likes)
		if(err)
			res.status(500).json(err);
		else
			res.status(200).json({status:true,items:likes});
	})

}

function areNewLikes(req,res){
	Likes.find({userId:req.body.idString, viewed:false},(err,likes)=>{
		console.log(likes)
		if(err)
			res.status(500).json(err);
		else if (likes.length)
			res.status(200).json({status:true});
		else
			res.status(200).json({status:false});
	})

	
}

module.exports = {
	getUser,
	getUsers,
	getUserByEmail,
	getUserByUsername,
	addUser,
	updateUser,
	getFriends,
	addFollower,
	deleteFollower,
	getLikesUser,
	areNewLikes
}
