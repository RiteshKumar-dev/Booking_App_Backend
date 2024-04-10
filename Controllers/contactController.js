const Contact = require("../Models/ContactModel");

const contactController = async (req, res) => {
  try {
    const { username, email, message } = req.body;

    // Validate input
    if (!username || !email || !message) {
      return res.status(400).json({ error: "Name, email, and message are required fields" });
    }

    // Create new contact
    const newContact = await Contact.create({
      username,
      email,
      message
    });

    return res.status(201).json({ message: "Message sent successfully", data: newContact });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};


const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    if (!contacts || contacts.length === 0) {
      return res.status(404).json({ message: "NO contacts in database..." });
    }
    return res.status(200).json(contacts);
  } catch (error) {
    console.log("Error GetRoute Contact:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteContactsById = async (req, res) => {
  const contactId = req.params.id;

  try {
    const contact = await Contact.findByIdAndDelete(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    return res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.log("Error deleting Contact:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { contactController, getAllContacts, deleteContactsById };
