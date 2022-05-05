import express from 'express';
import {
    insertUser,
    getUser,
    updateUser,
    deleteUser,
    AddFollowers,
    RemoveFollowers,
} from '../controllers/user.controller.js';
import { loginRequired, userRequired } from '../middlewares/interceptors.js';
const router = express.Router();

router.post('/', insertUser);
router.get('/:id', getUser);
router.delete('/:id', loginRequired, userRequired, deleteUser);
router.patch('/remove/:id', loginRequired, RemoveFollowers);
router.patch('/following/:id', loginRequired, AddFollowers);
router.patch('/:id', loginRequired, updateUser);

export default router;
