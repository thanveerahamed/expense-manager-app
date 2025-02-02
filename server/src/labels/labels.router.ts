import { Request, Response, Router } from 'express';
import { addLabel } from './labels.service';
import { getLabels } from '../common/labels';

export const labelsRouter = Router();

labelsRouter.get('/all', async (req: Request, res: Response) => {
  const userId = req.body.userId;
  try {
    const labels = await getLabels({ userId });
    res.status(200).send(labels);
  } catch (e: any) {
    console.log(e);
    res.status(500).send(e);
  }
});

labelsRouter.post('/add', async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const name = req.body.name;
  try {
    const labels = await addLabel({ userId, name });
    res.status(200).send(labels);
  } catch (e: any) {
    console.log(e);
    res.status(500).send(e);
  }
});
