import express from 'express';
import {
    getItem,
    getAllItems,
    insertItem,
    updateItem,
    deleteItem,
} from '../controllers/item.controller.js';
import { loginRequired, userRequired } from '../middlewares/interceptors.js';

const router = express.Router();
router.get('/:id', getItem);
router.get('/', getAllItems);
router.post('/', loginRequired, insertItem);
router.delete('/:id', loginRequired, userRequired, deleteItem);
router.patch('/:id', loginRequired, userRequired, updateItem);
export default router;
