import { Router } from 'express';
import { outStcokController } from './outStock.controller';
const router = Router();

router.post('/createOutStcok', outStcokController.createOutStcok);
router.get('/', outStcokController.getAllOutStcok);

export const OutStcokRoutes = router;
