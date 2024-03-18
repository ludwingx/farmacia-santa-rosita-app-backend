import { Router } from 'express';
import {  getRole, getRoles, postRole, updateRole } from '../controllers/roles';

const router = Router();

router.get('/', getRoles);
router.get('/:id', getRole);
router.post('/', postRole);
router.put('/:id', updateRole);

export default router;