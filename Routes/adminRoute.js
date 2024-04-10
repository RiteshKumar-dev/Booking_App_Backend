const express = require('express')
const { getAllUsers, deleteUserById, getUserById, updateUserById, } = require("../Controllers/adminController")
const adminMiddleware = require('../MiddleWares/adminMiddleware')
const authMiddleWare = require("../Middlewares/authMiddleWare")
const router = express.Router()


router.route("/users").get(authMiddleWare, adminMiddleware, getAllUsers)
router.route("/users/:id").get(authMiddleWare, adminMiddleware, getUserById)
router.route("/users/update/:id").patch(authMiddleWare, adminMiddleware, updateUserById)
router.route("/users/delete/:id").delete(authMiddleWare, adminMiddleware, deleteUserById)



module.exports = router