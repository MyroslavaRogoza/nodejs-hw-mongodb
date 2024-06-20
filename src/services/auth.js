import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { Session } from '../db/models/session.js';
import { FIFTEEN_MINUTES, ONE_MONTH } from '../constants/index.js';

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

  const lastSession = await Session.findOne({ userId: user._id });

  if (lastSession) {
    await Session.deleteOne({ _id: lastSession._id });
  }

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  const session = await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
  });

  return session;
};
