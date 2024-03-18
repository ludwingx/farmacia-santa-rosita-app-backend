import { Router } from 'express';
import {getUsers, getUser, updateUser, postUser} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.post('/', postUser);

export default router;