import { Router } from 'express';
import { expenseController } from './expense.controller';

const router = Router();

router.post('/create', expenseController.createExpense);

router.delete('/:id', expenseController.deletedExpense);
router.get('/', expenseController.getAllExpense);

export const expensRoute = router;
