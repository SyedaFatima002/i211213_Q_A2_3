const express = require("express");
const { AuthenticateUser } = require("../authenticate");
const {register , getprofile, Login, updateprofile, deleteprofile, addfollower, addfollowing,
    removefollower, removefollowing,} = require("../controllers/usercontroller")
const router = express.Router();

router.post('/login' , Login )
router.post('/register', register)
router.get('/profile/:username' , getprofile)
router.put('/profile/:username',  updateprofile)
router.delete('/profile/:username',  deleteprofile)
router.post('/addfollower/:username', addfollower)
router.post('/removefollower/:username', removefollower)
router.post('/follow/:username', addfollowing)
router.post('/unfollow/:username', removefollowing)

module.exports = router;
