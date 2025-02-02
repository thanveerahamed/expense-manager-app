import { Request, Response, Router } from 'express';
import { logError } from '../common/logging';
import {
  getDashboardData,
  getDashboardLabelsData,
  getNewTransactions,
  makeTransactionOld,
} from './dashboard.service';

export const dashboardRouter = Router();

dashboardRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const response = await getDashboardData(userId);
    res.status(200).send(response);
  } catch (error: any) {
    logError('Error occurred', { location: 'getDashboardData', error });
    res.status(500).send(error);
  }
});

dashboardRouter.get('/labels', async (req: Request, res: Response) => {
  const { userId } = req.body;
  try {
    const response = await getDashboardLabelsData(userId);
    res.status(200).send(response);
  } catch (error: any) {
    logError('Error occurred', { location: 'getDashboardLabelsData', error });
    res.status(500).send(error);
  }
});

dashboardRouter.get(
  '/new-transactions',
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    try {
      const response = await getNewTransactions(userId);
      res.status(200).send(response);
    } catch (error: any) {
      logError('Error occurred', { location: 'getNewTransactions', error });
      res.status(500).send(error);
    }
  },
);

dashboardRouter.post(
  '/set-transaction-old',
  async (req: Request, res: Response) => {
    const { userId, transactionId } = req.body;
    try {
      const response = await makeTransactionOld({ userId, transactionId });
      res.status(200).send(response);
    } catch (error: any) {
      logError('Error occurred', { location: 'makeTransactionOld', error });
      res.status(500).send(error);
    }
  },
);
