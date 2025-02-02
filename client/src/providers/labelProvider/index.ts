import { LabelWithId } from '../../common/types/labels';
import { apiGet, apiPost } from '../common';
import { HOST_URL } from '../common/constants';

const labelsUrl = `${HOST_URL}/labels`;

export const getAllLabels = async (): Promise<LabelWithId[]> => {
  const getAllLabels = `${labelsUrl}/all`;
  return apiGet<LabelWithId[]>(getAllLabels);
};

export const addLabel = async (name: string): Promise<LabelWithId[]> => {
  const addLabel = `${labelsUrl}/add`;
  return apiPost<LabelWithId[]>(addLabel, { name });
};
