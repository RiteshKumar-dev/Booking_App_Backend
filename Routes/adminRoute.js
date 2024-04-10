const express = require('express')
const { getAllUsers, deleteUserById, getUserById, updateUserById, } = require("../Controllers/adminController")
const adminMiddleware = require('../MiddleWares/adminMiddleware')
const { authMiddleware } = require("../MiddleWares/authMiddleware")
const router = express.Router()


router.route("/users").get(authMiddleware, adminMiddleware, getAllUsers)
router.route("/users/:id").get(authMiddleware, adminMiddleware, getUserById)
router.route("/users/update/:id").patch(authMiddleware, adminMiddleware, updateUserById)
router.route("/users/delete/:id").delete(authMiddleware, adminMiddleware, deleteUserById)



module.exports = router