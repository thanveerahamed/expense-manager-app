import { Request, Response, Router } from 'express';
import {
  assignCategory,
  assignLabels,
  getTransactionById,
  getTransactions,
  getTransactionsBetweenDates,
  getTransactionsUntil,
  splitTransaction,
  unAssignLabels,
  updateNote,
  updateVendorName,
} from './transactions.service';
import { logError } from '../common/logging';
import { validatePayload } from '../common/joi/validation';
import {
  GetTransactionsBetweenDatesPayload,
  getTransactionsBetweenDatesSchema,
} from './transactions.interface';

export const transactionsRouter = Router();

transactionsRouter.post('/all', async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const nextPageToken = req.body.nextPageToken;
  try {
    const response = await getTransactions({ userId, nextPageToken });
    res.status(200).send(response);
  } catch (error: any) {
    logError('Error occurred', { location: 'getTransactions', error });
    res.status(500).send(error);
  }
});

transactionsRouter.get(
  '/until/:transactionId',
  async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const transactionId = req.params.transactionId;
    try {
      const response = await getTransactionsUntil({ userId, transactionId });
      res.status(200).send(response);
    } catch (error: any) {
      logError('Error occurred', { location: 'getTransactionsUntil', error });
      res.status(500).send(error);
    }
  },
);

transactionsRouter.get(
  '/:transactionId',
  async (req: Request, res: Response) => {
    const userId = req.body.userId;
    const transactionId = req.params.transactionId;
    try {
      const response = await getTransactionById(transactionId, userId);
      res.status(200).send(response);
    } catch (error: any) {
      logError('Error occurred', { location: 'getTransactionById', error });
      res.status(500).send(error);
    }
  },
);

transactionsRouter.post(
  '/labels/assign',
  async (req: Request, res: Response) => {
    const { userId, transactionId, labels } = req.body;
    try {
      const transaction = await assignLabels({ userId, transactionId, labels });
      res.status(200).send(transaction);
    } catch (error: any) {
      logError('Error occurred', { location: 'assignLabels', error });
      res.status(500).send(error);
    }
  },
);

transactionsRouter.post(
  '/labels/remove',
  async (req: Request, res: Response) => {
    const { userId, transactionId, label } = req.body;
    try {
      const transaction = await unAssignLabels({
        userId,
        transactionId,
        label,
      });
      res.status(200).send(transaction);
    } catch (error: any) {
      logError('Error occurred', { location: 'unAssignLabels', error });
      res.status(500).send(error);
    }
  },
);

transactionsRouter.put(
  '/:transactionId/category/assign/:categoryId',
  async (req: Request, res: Response) => {
    const { userId } = req.body;
    const { transactionId, categoryId } = req.params;
    try {
      const transaction = await assignCategory({
        userId,
        transactionId,
        categoryId,
      });
      res.status(200).send(transaction);
    } catch (error: any) {
      logError('Error occurred', { location: 'unAssignLabels', error });
      res.status(500).send(error);
    }
  },
);

transactionsRouter.put(
  '/:transactionId/name',
  async (req: Request, res: Response) => {
    const { userId, name } = req.body;
    const { transactionId } = req.params;
    try {
      const transaction = await updateVendorName({
        userId,
        transactionId,
        name,
      });
      res.status(200).send(transaction);
    } catch (error: any) {
      logError('Error occurred', { location: 'updateVendorName', error });
      res.status(500).send(error);
    }
  },
);

transactionsRouter.put(
  '/:transactionId/note',
  async (req: Request, res: Response) => {
    const { userId, note } = req.body;
    const { transactionId } = req.params;
    try {
      const transaction = await updateNote({
        userId,
        transactionId,
        note,
      });
      res.status(200).send(transaction);
    } catch (error: any) {
      logError('Error occurred', { location: 'updateNote', error });
      res.status(500).send(error);
    }
  },
);

transactionsRouter.put(
  '/:transactionId/split',
  async (req: Request, res: Response) => {
    const { userId, amounts } = req.body;
    const { transactionId } = req.params;
    try {
      await splitTransaction({
        userId,
        transactionId,
        amounts,
      });
      res.status(202).send();
    } catch (error: any) {
      logError('Error occurred', { location: 'splitTransaction', error });
      res.status(500).send(error);
    }
  },
);

transactionsRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = req.body;
  const { startDate, endDate, labelId } = req.query;
  try {
    const validatedPayload =
      validatePayload<GetTransactionsBetweenDatesPayload>({
        schema: getTransactionsBetweenDatesSchema,
        payload: {
          userId,
          startDate: startDate as string,
          endDate: endDate as string,
          ...(labelId ? { labelId: labelId as string } : {}),
        },
      });

    const transactions = await getTransactionsBetweenDates(validatedPayload);
    res.status(200).send(transactions);
  } catch (error: any) {
    logError('Error occurred', { location: 'splitTransaction', error });
    res.status(500).send(error.message);
  }
});
