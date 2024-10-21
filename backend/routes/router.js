const express = require("express");
const router = new express.Router();
const controllers=require("../controollers/userControllers")
const authenticate =require('../middleware/authenticate.js')
router.get("/home/jugal", controllers.first);
router.post("/signin",controllers.form )
router.post("/signup",controllers.login )
router.get('/Count', authenticate, controllers.auth);
router.patch("/update",controllers.update )
router.get("/logout",controllers.logout)
module.exports = router;