const Contact = require('../models/Contact');

exports.createContact = async (req, res) => {
  try {
    const contact = new Contact({
      ...req.body
    });

    await contact.save();
    res.send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
  try {
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.getAllContact = async (req, res) => {
  try {
    const contact = await Contact.find();
    if (!contact) res.status(404).send('contact Not Found');
    contact.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.send(contact);
  } catch (error) {
    res.status(500).send(error);
  }
};
