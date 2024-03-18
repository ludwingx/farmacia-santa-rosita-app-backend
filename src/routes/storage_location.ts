import { Router } from 'express';
import { deleteStorageLocation, getStorageLocation, getStorageLocations, postStorageLocation, updateStorageLocation } from '../controllers/storage_location';

const router = Router();

router.get('/', getStorageLocations);
router.get('/:id', getStorageLocation);
router.delete('/:id', deleteStorageLocation);
router.post('/', postStorageLocation);
router.put('/:id', updateStorageLocation);

export default router;