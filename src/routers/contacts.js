import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createContactController,
  deleteContactController,
  getAllContactsController,
  getContactByIdController,
  patchContactController,
} from '../controllers/contacts.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/students.js';


const router = Router();

router.get('/contacts', ctrlWrapper(getAllContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/contacts',validateBody(createContactSchema), ctrlWrapper(createContactController));

router.patch('/:contactId', validateBody(updateContactSchema), ctrlWrapper(patchContactController));

router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
