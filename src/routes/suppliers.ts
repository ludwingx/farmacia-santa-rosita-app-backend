import { Router } from 'express';
import { deleteSupplier, getSupplier, getSuppliers, postSupplier, updateSupplier } from '../controllers/suppliers';

const router = Router();

router.get('/', getSuppliers);
router.get('/:id', getSupplier);
router.delete('/:id', deleteSupplier);
router.post('/', postSupplier);
router.put('/:id', updateSupplier);

export default router;