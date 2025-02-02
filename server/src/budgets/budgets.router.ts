import { Request, Response, Router } from 'express';
import {
  create,
  deleteBudget,
  getAll,
  getBudgetById,
  getTransactionByBudget,
  update,
} from './budgets.service';

export const budgetsRouter = Router();

budgetsRouter.get(
  '/:budgetId',
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;
    const { budgetId } = req.params;
    try {
      const budgets = await getBudgetById({ userId, budgetId });
      res.status(200).send(budgets);
    } catch (e: any) {
      console.log(e);
      res.status(500).send(e);
    }
  },
);

budgetsRouter.post(
  '/all',
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.body.userId;
    const month = req.body.month;
    try {
      const budgets = await getAll({ userId, month });
      res.status(200).send(budgets);
    } catch (e: any) {
      console.log(e);
      res.status(500).send(e);
    }
  },
);

budgetsRouter.post(
  '/:budgetId/transactions',
  async (req: Request, res: Response): Promise<void> => {
    const { userId, month } = req.body;
    const { budgetId } = req.params;
    try {
      const budgets = await getTransactionByBudget({ userId, month, budgetId });
      res.status(200).send(budgets);
    } catch (e: any) {
      console.log(e);
      res.status(500).send(e);
    }
  },
);

budgetsRouter.post('/', async (req: Request, res: Response): Promise<void> => {
  const { userId, budget } = req.body;
  try {
    const budgets = await create({ userId, budget });
    res.status(200).send(budgets);
  } catch (e: any) {
    console.log(e);
    res.status(500).send(e);
  }
});

budgetsRouter.put('/', async (req: Request, res: Response): Promise<void> => {
  const { userId, budget } = req.body;
  try {
    const budgets = await update({ userId, budget });
    res.status(200).send(budgets);
  } catch (e: any) {
    console.log(e);
    res.status(500).send(e);
  }
});

budgetsRouter.delete(
  '/:budgetId',
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.body;
    const { budgetId } = req.params;
    try {
      await deleteBudget({ userId, budgetId });
      res.status(200).send({ success: true });
    } catch (e: any) {
      console.log(e);
      res.status(500).send(e);
    }
  },
);
