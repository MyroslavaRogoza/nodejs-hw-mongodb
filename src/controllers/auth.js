import { ONE_MONTH } from '../constants/index.js';
import {
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
} from '../services/auth.js';

export const registerController = async (req, res) => {
  const user = await registerUser(req.body);

  res.json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginController = async (req, res) => {
  const session = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken: session.accessToken },
  });
};

export const refreshSessionController = async (req, res) => {
  const { sessionId, sessionToken } = req.cookies;

  const session = await refreshSession({ sessionId, sessionToken });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken: session.accessToken },
  });
};

export const logoutSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies;

  if (sessionId && refreshToken) {
    await logoutUser(sessionId, refreshToken);
  }

  res.clearCookie('sessionId');
  res.clearCookie('refreshToken');

  res.status(204).send();
};
