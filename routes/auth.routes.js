import express from 'express';
import { userRegister } from '../controllers/register.controller.js';
import { login } from '../controllers/login.controller.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', userRegister);
export default router;
