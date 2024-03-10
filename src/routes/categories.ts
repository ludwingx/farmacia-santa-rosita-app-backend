import { Router } from 'express';
import { deleteCategory, getCategory, getCategorys, postCategory, updateCategory } from '../controllers/categories';

const router = Router();

router.get('/', getCategorys);
router.get('/:id', getCategory);
router.delete('/:id', deleteCategory);
router.post('/', postCategory);
router.put('/:id', updateCategory);

export default router;