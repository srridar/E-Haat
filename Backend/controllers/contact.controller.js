import { ContactData } from "../models/Contact.js";



export const storeContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const contact = await ContactData.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    return res.status(201).json({
      message: "Contact message sent successfully",
      success: true,
      data: contact,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await ContactData.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


export const getContactById = async (req, res) => {
  try {
    const contact = await ContactData.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      data: contact,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


export const deleteContact = async (req, res) => {
  try {
    const contact = await ContactData.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
        success: false,
      });
    }

    await contact.deleteOne();

    return res.status(200).json({
      message: "Contact deleted successfully",
      success: true,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


export const markAsRead = async (req, res) => {
  try {
    const contact = await ContactData.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
        success: false,
      });
    }

    contact.isRead = true;
    await contact.save();

    return res.status(200).json({
      message: "Marked as read",
      success: true,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};


