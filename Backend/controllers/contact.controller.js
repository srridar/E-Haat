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









