import createHttpError from 'http-errors';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'This email is already in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  const createdUser = await User.create({
    ...payload,
    password: encryptedPassword,
  });

  return createdUser;
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (!user) throw createHttpError(404, 'User not found');

  const isEqualPassword = await bcrypt.compare(payload.password, user.password);
  if (!isEqualPassword) throw createHttpError(401, 'Unauthorized');

  return user;
};
