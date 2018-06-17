var express = require("express"),
		Publication = require("../models/Publication"),
		Like = require("../models/Like"),
		mongoose = require("mongoose"),
		User = require("../models/User");

var router = express.Router();

router.post("/addPublication", (req,res)=>{
	console.log(req.body);
	let publication = new Publication(req.body);

	publication.save()
	.then(p => {
		res.status(200).json(p);
	})
	.catch(err=>res.status(500).json(err));
})

router.post("/getPublicationsHome", (req,res)=>{
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
						p.set('followed', user.favorites.indexOf(p._id)!=-1);
					})
					res.status(200).json(publications);
				})
			})
		}
	})
})

//CAMBIAR EL PROVIDER
router.post("/getPublicationsUser", (req,res)=>{
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
						p.set('followed', user.favorites.indexOf(p._id)!=-1);
					})
					res.status(200).json(publications);
				})
			})
		}
	})
})

router.post("/getPublicationsFavorites", (req,res)=>{
	let userIdLogged = mongoose.Types.ObjectId(req.body.idString);
	User.find({_id:userIdLogged}, '-_id favorites')
	.populate({path:'favorites'})
	.exec((err,publications)=>{
		publications = publications[0].favorites;
		if(err)
			res.status(500).json({err});
		else if(!publications.length)
			res.status(404).json({message: "No hay publicaciones"})
		else{
			Like.find({"userId":userIdLogged}, '-_id publicationId', (err,likes)=>{
				User.findById(userIdLogged,'-_id favorites',(err,user)=>{
					likes=likes.map(l=>String(l.publicationId));
					publications.forEach(p=>{
						p.set('liked', likes.indexOf(String(p._id))!=-1);
						p.set('followed', user.favorites.indexOf(p._id)!=-1);
					})
					res.status(200).json(publications);
				})
			})
		}
	})
})

router.post("/addLike", (req,res)=>{
	let like = new Like(req.body.like);
	like.save()
	.then(l=>{
		res.status(200).json(l);
	})
	.catch(err=>{
		res.status(500).json(err);
	})
})

router.post("/deleteLike", (req,res)=>{
	Like.findOneAndRemove({publicationId:req.body.like.publicationId, userId: req.body.like.userId},(err,like)=>{
		if(err)
			res.status(500).json(err);
		else
			res.status(200).json(like);
	})
})

router.post("/addFavorite", (req,res)=>{
	User.update({_id:req.body.userId},{ $addToSet : { favorites: req.body.publicationId } }, (err,user)=>{
		if(err)
			res.status(500).json(err);
		else
			res.status(200).json(user);	
	})
})

router.post("/deleteFavorite", (req,res)=>{
	User.update({_id:req.body.userId},{ $pull : { favorites: req.body.publicationId } }, (err,user)=>{
		if(err)
			res.status(500).json(err);
		else
			res.status(200).json(user);	
	})
})




module.exports = router;