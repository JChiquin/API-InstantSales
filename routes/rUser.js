var express = require("express"),
	cUser = require("../controllers/cUser");

var router = express.Router();

router.post("/getUser",cUser.getUser);
router.post("/getUserByUsername",cUser.getUserByUsername);
router.post("/getUserByEmail",cUser.getUserByEmail);
router.get("/",cUser.getUsers);


module.exports = router;