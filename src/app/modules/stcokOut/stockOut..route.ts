import { Router } from 'express';
import { stcokOutController } from './stockOut.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.canstance';
const router = Router();

router.post(
  '/createOutStcok',
  auth(USER_ROLE.admin, USER_ROLE.user),
  stcokOutController.createstockOut,
);
router.get('/getLast30DaysSalesFromDb', stcokOutController.getLast30DaysSales);
router.get('/getAllprofit', stcokOutController.getAllProfits);
router.delete('/:id', stcokOutController.deletedSingleStockOut);
router.get('/:id', stcokOutController.getSingleStockOut);
router.get('/bySellsman/:id', stcokOutController.getSingleStockOutBySellsman);

router.get('/', stcokOutController.getAllstockOut);

export const stcokOutRoutes = router;
