import { Request, Response, Router } from 'express';
import { getMonths } from './months.service';

export const monthsRouter = Router();

monthsRouter.get('/all', async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const months = await getMonths(userId);
    res.status(200).send(months);
  } catch (e: any) {
    console.log(e);
    res.status(500).send(e);
  }
});
