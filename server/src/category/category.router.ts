import { Request, Response, Router } from 'express';
import { getAllCategories } from './category.service';

export const categoryRouter = Router();

categoryRouter.get('/all', async (req: Request, res: Response) => {
  try {
    res.status(200).send(await getAllCategories());
  } catch (e) {
    res.status(500).send(e);
  }
});
