import { Router } from 'express';
import { getPurchases, getPurchaseById, postPurchase } from '../controllers/purchases';
import validateToken from '../libs/validateToken';

const router = Router();

router.get('/', validateToken, getPurchases);
router.get('/:id', validateToken, getPurchaseById);
router.post('/', validateToken, postPurchase);

export default router;
