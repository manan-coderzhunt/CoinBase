const express = require('express');
const authController = require('../controller/authController');
const router = express.Router();


//user

//register
router.post('/register', authController.register);

//login
router.post('/login', authController.login);

//logout
//refresh


//blog
//CRUD
//create
//read all blogs
//read blog by id
//update
//delete


// comments
// create comment
// read comments by blog id


module.exports = router;