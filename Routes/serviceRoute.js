const express = require("express")
const { getAllServices, deleteServicesById } = require("../Controllers/servicesController")
const adminMiddleware = require('../MiddleWares/adminMiddleware')
const { authMiddleware } = require("../MiddleWares/authMiddleware")
const router = express.Router()


router.route("/services").get(authMiddleware, adminMiddleware, getAllServices)
router.route("/services/delete/:id").delete(authMiddleware, adminMiddleware, deleteServicesById)

module.exports = router