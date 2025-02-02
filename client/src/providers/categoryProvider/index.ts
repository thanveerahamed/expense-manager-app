import { OrderedCategory } from '../../common/types';
import { apiGet } from '../common';
import { HOST_URL } from '../common/constants';

const categoryUrl = `${HOST_URL}/category`;

export const getCategories = async (): Promise<OrderedCategory[]> => {
  const getAllCategoryUrl = `${categoryUrl}/all`;
  return apiGet<OrderedCategory[]>(getAllCategoryUrl);
};
