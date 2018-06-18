var express = require("express"),
	cPublication = require("../controllers/cPublication");

var router = express.Router();

router.post("/addPublication", cPublication.addPublication)
router.post("/getPublicationsHome", cPublication.getPublicationsHome);
//CAMBIAR EL PROVIDER
router.post("/getPublicationsUser", cPublication.getPublicationsUser)
router.post("/getPublicationsFavorites", cPublication.getPublicationsFavorites);
router.post("/addLike", cPublication.addLike)
router.post("/deleteLike", cPublication.deleteLike);
router.post("/addFavorite", cPublication.addFavorite);
router.post("/deleteFavorite", cPublication.deleteFavorite);
router.get("/", cPublication.getPublications);

module.exports = router;