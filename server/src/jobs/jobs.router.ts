import { Request, Response, Router } from 'express';
import { createSyncTransactionsJob } from './jobs.service';
import { getSyncTransactionsJobs } from '../common/jobs';

export const jobsRouter = Router();

jobsRouter.get('/syncTransactions', async (req: Request, res: Response) => {
  const { userId } = req.body;

  try {
    const transactionJobs = await getSyncTransactionsJobs(userId);
    res.status(200).send(transactionJobs);
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
});

jobsRouter.get(
  '/createSyncTransactionsJob',
  async (req: Request, res: Response) => {
    const { userId } = req.body;

    try {
      await createSyncTransactionsJob(userId);
      res.status(200).send({ success: true });
    } catch (e) {
      console.log(e);
      res.status(500).send(e);
    }
  },
);
