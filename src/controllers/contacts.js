import mongoose from 'mongoose';
import { getAllContacts, getContactById } from "../services/contacts.js";

export const getAllContactsController =async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      message: 'Successfully found all contacts!',
      data: contacts,
    });
  };


  export const getContactByIdController = async (req, res) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      res.status(404).json({
        message: 'not found',
      });
      return;
    }
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        message: 'there is no contact with this id',
      });
    }
    res.status(200).json({
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  };
