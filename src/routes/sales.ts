import { Router } from 'express';
import { getSales, getSaleById, postSale, cancelSale } from '../controllers/sales';
import validateToken from '../libs/validateToken';

const router = Router();

router.get('/', validateToken, getSales);
router.get('/:id', validateToken, getSaleById);
router.post('/', validateToken, postSale);
router.put('/cancel/:id', validateToken, cancelSale);

export default router;
