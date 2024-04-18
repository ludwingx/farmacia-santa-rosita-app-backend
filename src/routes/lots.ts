import { Router } from 'express';
import {  getLot, getLots, postLot, updateLot } from '../controllers/lots';

const router = Router();

router.get('/', getLots);
router.get('/:id', getLot);
router.post('/', postLot);
router.put('/:id', updateLot);

export default router;