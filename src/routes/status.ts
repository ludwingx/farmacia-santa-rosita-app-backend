import { Router } from 'express';
import {  getStatus, getStatuses, postStatus, updateStatus } from '../controllers/status';

const router = Router();

router.get('/', getStatuses);
router.get('/:id', getStatus);
router.post('/', postStatus);
router.put('/:id', updateStatus);

export default router;