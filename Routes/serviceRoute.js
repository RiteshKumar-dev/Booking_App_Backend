const express = require("express")
const { getAllServices, deleteServicesById } = require("../Controllers/servicesController")
const adminMiddleware = require('../MiddleWares/adminMiddleware')
const authMiddleWare = require("../Middlewares/authMiddleWare")
const router = express.Router()


router.route("/services").get(authMiddleWare, adminMiddleware, getAllServices)
router.route("/services/delete/:id").delete(authMiddleWare, adminMiddleware, deleteServicesById)

module.exports = router