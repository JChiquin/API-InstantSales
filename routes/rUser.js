var express = require("express"),
	cUser = require("../controllers/cUser");

var router = express.Router();

router.post("/getUser",cUser.getUser);
router.post("/addUser",cUser.addUser);
router.post("/getFriends",cUser.getFriends);
router.post("/updateUser",cUser.updateUser);
router.post("/getUserByUsername",cUser.getUserByUsername);
router.post("/getUserByEmail",cUser.getUserByEmail);
router.post("/addFollower",cUser.addFollower);
router.post("/deleteFollower",cUser.deleteFollower);
router.post("/getLikesUser",cUser.getLikesUser);
router.post("/areNewLikes",cUser.areNewLikes);
router.get("/",cUser.getUsers);


module.exports = router;