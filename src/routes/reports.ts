import { Router } from 'express';
import { getDashboardSummary, getCriticalStock } from '../controllers/reports';
import validateToken from '../libs/validateToken';

const router = Router();

router.get('/dashboard', validateToken, getDashboardSummary);
router.get('/critical-stock', validateToken, getCriticalStock);

export default router;
