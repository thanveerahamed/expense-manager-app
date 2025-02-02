import Joi from 'joi';
import { TransactionFilters } from '../common/labels/types';

export const getLabelsOverviewRequestSchema = Joi.object<TransactionFilters>({
  userId: Joi.string().required(),
  id: Joi.string().optional(),
  startDate: Joi.string()
    .required()
    .regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
  endDate: Joi.string()
    .required()
    .regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
});
