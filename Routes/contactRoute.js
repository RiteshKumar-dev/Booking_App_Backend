const express = require("express")
const router = express.Router()
const { contactController, getAllContacts, deleteContactsById } = require("../Controllers/contactController")
const adminMiddleware = require('../MiddleWares/adminMiddleware')
const { authMiddleware } = require("../MiddleWares/authMiddleware")

router.route("/contacts").post(authMiddleware, contactController)
router.route("/contacts").get(authMiddleware, adminMiddleware, getAllContacts)
router.route("/contacts/delete/:id").delete(authMiddleware, adminMiddleware, deleteContactsById)


module.exports = router;