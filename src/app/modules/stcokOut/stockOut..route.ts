import { Router } from 'express';
import { stcokOutController } from './stockOut.controller';
const router = Router();

router.post('/createOutStcok', stcokOutController.createstockOut);

router.delete('/:id', stcokOutController.deletedSingleStockOut);
router.get('/', stcokOutController.getAllstockOut);

export const stcokOutRoutes = router;
