const express = require('express');
const authMiddleWare = require('../MiddleWares/authMiddleWare');
const authController = require('../Controllers/authController');
const router = express.Router();

router.route("/").get(authController.home)
router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/user').get(authMiddleWare, authController.getUser);

module.exports = router;
