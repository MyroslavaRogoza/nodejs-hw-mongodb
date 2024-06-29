import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { ContactsCollection } from '../db/models/contact.js';
import { SORT_ORDER } from '../constants/index.js';
import { saveFileToCloudinary } from '../utils/saveToCloudinary.js.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
  userId,
}) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  let contactsFilter = ContactsCollection.find();
  if (filter.type) {
    contactsFilter.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsFilter.where('isFavourite').equals(filter.isFavourite);
  }

  contactsFilter.where('userId').equals(userId);

  const [contactsCount, contacts] = await Promise.all([
    ContactsCollection.find().merge(contactsFilter).countDocuments(),
    contactsFilter
      .skip(skip)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .exec(),
  ]);

  const paginationData = calculatePaginationData(contactsCount, perPage, page);
  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId: userId,
  });
  return contact;
};

export const createContact = async ({ photo, ...payload }, userId) => {
  const contact = await ContactsCollection.create({
    ...payload,
    photo: photo,
    userId: userId,
  });
  return contact;
};

export const updateContact = async (
  contactId,
  { photoUrl, ...payload },
  userId,
  options = {},
) => {
  const updatedContact = await ContactsCollection.findByIdAndUpdate(
    contactId,
    { ...payload, photo: photoUrl },
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );
  return updatedContact;
};

export const deleteContact = async (contactId, userId) => {
  const deletedContact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId: userId,
  });
  return deletedContact;
};
//{ _id: contactId, userId: userId },
