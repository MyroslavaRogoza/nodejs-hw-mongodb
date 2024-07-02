import { Router } from 'express';
import { ResetEmailSchema, loginSchema, registerSchema, resetPasswordSchema } from '../validation/auth.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginController, logoutSessionController, refreshSessionController, registerController, resetEmailController, resetPasswordController } from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshSessionController));

router.post('/logout', ctrlWrapper(logoutSessionController));

router.post('/send-reset-email', validateBody(ResetEmailSchema), ctrlWrapper(resetEmailController));

router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
export default router;
