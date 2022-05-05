import express from 'express';
import {
    getCollection,
    getAllCollections,
    insertCollection,
    updateCollection,
    deleteCollection,
} from '../controllers/collection.controller.js';

import { loginRequired, userRequired } from '../middlewares/interceptors.js';
const router = express.Router();

router.get('/', getAllCollections);
router.post('/', loginRequired, insertCollection);
router.get('/:id', getCollection);
router.delete('/:id', loginRequired, userRequired, deleteCollection);
router.patch('/:id', loginRequired, userRequired, updateCollection);
export default router;
