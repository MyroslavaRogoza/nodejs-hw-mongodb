import createHttpError from 'http-errors';
import { randomBytes } from 'crypto';
import { User } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { Session } from '../db/models/session.js';
import { FIFTEEN_MINUTES, ONE_MONTH } from '../constants/index.js';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });

  if (user) throw createHttpError(409, 'Email in use');

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

const createNewSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');
  const createdSession = {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
  };

  return createdSession;
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createNewSession();

  await Session.deleteOne({ _id: session._id });

  const refreshedSession = await Session.create({
    ...newSession,
    _id: session._id,
  });
  return refreshedSession;
};

export const logoutUser = async ( sessionId, refreshToken) => {

  await Session.deleteOne({ _id: sessionId, refreshToken: refreshToken });
};
