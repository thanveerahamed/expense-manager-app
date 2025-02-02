import { LabelWithAmount } from '../../common/types/labels';
import { apiGet } from '../common';
import { HOST_URL } from '../common/constants';

const labelsOverviewsUrl = `${HOST_URL}/labelsOverviews`;

export interface LabelsOverviewsFilters {
  id?: string;
  startDate?: string;
  endDate?: string;
}

const getQueryParameters = (filters: LabelsOverviewsFilters) => {
  return Object.keys(filters).reduce((query, key): Record<string, string> => {
    if (key in filters) {
      return {
        ...query,
        [key]: filters[key as keyof LabelsOverviewsFilters],
      };
    }

    return query;
  }, {});
};

export const getLabelsOverviews = async ({
  filters,
}: {
  filters: LabelsOverviewsFilters;
}): Promise<LabelWithAmount[]> => {
  const searchParams = new URLSearchParams(getQueryParameters(filters));

  const getLabelsOverviewsUrl = `${labelsOverviewsUrl}?${searchParams.toString()}`;
  return apiGet<LabelWithAmount[]>(getLabelsOverviewsUrl);
};
