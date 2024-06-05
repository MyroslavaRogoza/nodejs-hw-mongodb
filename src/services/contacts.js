import { ContactsCollection } from "../db/models/contact.js";

export const getAllContacts = async () => {
  const contacts = await ContactsCollection.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createStudent = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};
