var	Publication = require("../models/Publication"),
	Like = require("../models/Like"),
	mongoose = require("mongoose"),
	User = require("../models/User");

let ba64 = require("ba64"),
	fs = require('fs');

function getPublicationsFavorites(req, res){
	let userIdLogged = mongoose.Types.ObjectId(req.body.idString);
	User.findById(userIdLogged, '-_id favorites')
	.populate({path:'favorites', populate:{path:'userId'}})
	.exec((err,publications)=>{
		publications = publications.favorites;
		if(err)
			res.status(500).json({err});
		else if(!publications)
			res.status(404).json({message: "No hay publicaciones"})
		else{
			Like.find({"userId":userIdLogged}, '-_id publicationId', (err,likes)=>{
				User.findById(userIdLogged,'-_id favorites',(err,user)=>{
					likes=likes.map(l=>String(l.publicationId));
					publications.forEach(p=>{
						p.set('liked', likes.indexOf(String(p._id))!=-1);
						if(user)
							p.set('favorited', user.favorites.indexOf(p._id)!=-1);
					})
					res.status(200).json({status:true,items:publications});
				})
			})
		}
	})
}

function addLike(req, res){
	let like = new Like(req.body.like);
	like.save()
	.then(l=>{
		res.status(200).json(l);
	})
	.catch(err=>{
		res.status(500).json(err);
	})
}

function deleteLike(req,res){
	Like.findOneAndRemove({publicationId:req.body.like.publicationId, 
							userId: req.body.like.userId},
							(err,like)=>{
		if(err)
			res.status(500).json(err);
		else
			res.status(200).json(like);
	})
}

function addFavorite(req,res){
	User.update({_id:req.body.favorite.userId},
				{ $addToSet : { favorites: req.body.favorite.publicationId } },
				(err,user)=>{
		if(err)
			res.status(500).json(err);
		else
			res.status(200).json(user);	
	})
}

function deleteFavorite(req,res){
	User.update({_id:req.body.favorite.userId},{ $pull : { favorites: req.body.favorite.publicationId } }, (err,user)=>{
		if(err)
			res.status(500).json(err);
		else
			res.status(200).json(user);	
	})
}

function getPublicationsUser(req,res){
	let userIdLogged = mongoose.Types.ObjectId(req.body.userIdLogged);
	let userIdPublications = mongoose.Types.ObjectId(req.body.userIdPublications);
	Publication.find({userId:userIdPublications})
	.populate({path:'userId'})
	.exec((err,publications)=>{
		if(err)
			res.status(500).json({err});
		else if(!publications)
			res.status(404).json({message: "No hay publicaciones"})
		else{
			Like.find({"userId":userIdLogged}, '-_id publicationId', (err,likes)=>{
				User.findById(userIdLogged,'-_id favorites',(err,user)=>{
					likes=likes.map(l=>String(l.publicationId));
					publications.forEach(p=>{
						p.set('liked', likes.indexOf(String(p._id))!=-1);
						p.set('favorited', user.favorites.indexOf(p._id)!=-1);
					})
					res.status(200).json({status:true,items:publications});
				})
			})
		}
	})
}

function getPublicationsHome(req,res){
	let userIdLogged = mongoose.Types.ObjectId(req.body.idString);
	Publication.find()
	.populate({path:'userId'})
	.exec((err,publications)=>{
		if(err)
			res.status(500).json({err});
		else if(!publications)
			res.status(404).json({message: "No hay publicaciones"})
		else{
			Like.find({"userId":userIdLogged}, '-_id publicationId', (err,likes)=>{
				User.findById(userIdLogged,'-_id favorites',(err,user)=>{
					likes=likes.map(l=>String(l.publicationId));
					publications.forEach(p=>{
						p.set('liked', likes.indexOf(String(p._id))!=-1);
						p.set('favorited', user.favorites.indexOf(p._id)!=-1);
					})
					res.status(200).json({status:true,items:publications});
				})
			})
		}
	})
}

function addPublication(req,res){

	let body = req.body.publication;
	let photoBase64 = body.photo;
	delete body.photo;
	let publication = new Publication(body);

	publication.save()
	.then(p => {
		let dir = "./public/imgs/publications/"+p._id;
		fs.mkdirSync(dir);
		ba64.writeImage(dir+"/"+p._id, photoBase64, function(err){
		    if (err) throw err;
		    console.log("Image saved successfully");
		    Publication.findByIdAndUpdate(p._id,{$set:{photo:"http://localhost:3000/imgs/publications/"+p._id+"/"+p._id+".jpeg"}}, (err,pUpdate)=>{
		    	if(err)
		    		res.status(500).json(err);
		    	else
		    		res.status(200).json(pUpdate);
		    })
		});
		
		User.findByIdAndUpdate(p.userId,{$inc:{countPublications:1}})
	})
	.catch(err=>res.status(500).json(err));

	
}

function getPublications(req,res){
	Publication.find({},(err,publications)=>{
		res.json({status:true,items:publications});
	})
}

module.exports = {
	getPublicationsFavorites,
	addLike,
	deleteLike,
	addFavorite,
	deleteFavorite,
	addPublication,
	getPublicationsHome,
	getPublicationsUser,
	getPublications
}