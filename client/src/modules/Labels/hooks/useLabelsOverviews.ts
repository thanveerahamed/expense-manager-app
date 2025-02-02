import { useEffect, useState } from 'react';

import { Duration } from '../../../context/TimelineFilterContext';

import { LabelWithAmount } from '../../../common/types/labels';
import { getLabelsOverviews } from '../../../providers/labelsOverviewsProvider';

export interface Props {
  duration: Duration;
}

export const useLabelsOverviews = ({ duration }: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [labelsOverviews, setLabelsOverviews] = useState<LabelWithAmount[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);

  const reload = () => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await getLabelsOverviews({
          filters: {
            startDate: duration.startDate.format('YYYY-MM-DD'),
            endDate: duration.endDate.format('YYYY-MM-DD'),
          },
        });

        setLabelsOverviews(response);
      } catch (e: any) {
        setError(new Error(e));
      }
      setIsLoading(false);
    })();
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration]);

  return {
    isLoading,
    error,
    reload,
    labelsOverviews,
  };
};
