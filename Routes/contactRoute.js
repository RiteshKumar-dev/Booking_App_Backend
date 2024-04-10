const express = require("express")
const router = express.Router()
const { contactController, getAllContacts, deleteContactsById } = require("../Controllers/contactController")
const adminMiddleware = require('../MiddleWares/adminMiddleware')
const authMiddleWare = require("../Middlewares/authMiddleWare")

router.route("/contacts").post(authMiddleWare, contactController)
router.route("/contacts").get(authMiddleWare, adminMiddleware, getAllContacts)
router.route("/contacts/delete/:id").delete(authMiddleWare, adminMiddleware, deleteContactsById)


module.exports = router;