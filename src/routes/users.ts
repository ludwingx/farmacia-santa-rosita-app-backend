import { Router } from 'express';

import {getUsers, getUser, updateUser, postUser, updateUserStatus} from '../controllers/users';

const router = Router();


router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.post('/', postUser);
router.put('/:id/status', updateUserStatus);

export default router;