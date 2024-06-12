import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { ContactsCollection } from '../db/models/contact.js';

export const getAllContacts = async ({ page = 1, perPage = 5 }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactsCollection.find();

  // const contactsCount = await ContactsCollection.find().countDocuments();

  // const contacts = await contactsQuery.skip(skip).limit(limit).exec();


  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().countDocuments(),
    contactsQuery.skip(skip).limit(limit).exec(),
  ]);
  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId) => {
  const contact = await ContactsCollection.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const updateContact = async (contactId, payload, options = {}) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    payload,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  return updatedContact;
};

export const deleteContact = async (contactId) => {
  const deletedContact = await ContactsCollection.findByIdAndDelete(contactId);
  return deletedContact;
};
