import { Request, Response, Router } from 'express';
import { getLabelsOverviews } from './labelsOverviews.service';
import { validatePayload } from '../common/joi/validation';
import { getLabelsOverviewRequestSchema } from './labelsOverviews.interface';
import { TransactionFilters } from '../common/labels/types';

export const labelsOverviewsRouter = Router();

labelsOverviewsRouter.get('/', async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const { id, startDate, endDate } = req.query;
  try {
    const validatedPayload = validatePayload<TransactionFilters>({
      schema: getLabelsOverviewRequestSchema,
      payload: {
        userId,
        ...(id !== undefined && typeof id === 'string' ? { id } : {}),
        ...(startDate !== undefined && typeof startDate === 'string'
          ? { startDate }
          : {}),
        ...(endDate !== undefined && typeof endDate === 'string'
          ? { endDate }
          : {}),
      },
    });

    const labelsOverviews = await getLabelsOverviews(validatedPayload);
    res.status(200).send(labelsOverviews);
  } catch (e: any) {
    console.log(e);
    res.status(500).send(e.message);
  }
});
