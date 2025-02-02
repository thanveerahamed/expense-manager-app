import Joi from 'joi';

export const validatePayload = <T>({
  schema,
  payload,
}: {
  schema: Joi.Schema<T>;
  payload: T;
}) => {
  const { error, value } = schema.validate(payload);

  if (error) {
    throw new Error(error.message);
  }

  return value;
};
