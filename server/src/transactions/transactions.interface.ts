import Joi, { CustomHelpers } from 'joi';
import dayjs from 'dayjs';

export interface GetTransactionsBetweenDatesPayload {
  userId: string;
  startDate: string;
  endDate: string;
  labelId?: string;
}

const validateEndDateIsGreaterThanStartDate = (
  value: any,
  helpers: CustomHelpers,
) => {
  if (dayjs(value) < dayjs(helpers.state.ancestors[0].startDate)) {
    throw new Error('startDate is greater than endDate');
  }

  return value;
};

export const getTransactionsBetweenDatesSchema =
  Joi.object<GetTransactionsBetweenDatesPayload>({
    userId: Joi.string().required(),
    startDate: Joi.string()
      .required()
      .regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/),
    endDate: Joi.string()
      .required()
      .regex(/[0-9]{4}-[0-9]{2}-[0-9]{2}/)
      .custom(validateEndDateIsGreaterThanStartDate, 'custom'),
    labelId: Joi.string().optional(),
  });
