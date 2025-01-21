import {useEffect, useState} from 'react';

import {LabelWithAmount} from '../../../common/types/labels';
import {getDashboardLabelsData} from '../../../providers';

export const useDashboardLabelsData = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [labelsOverviews, setLabelsOverviews] = useState<LabelWithAmount[]>([]);
    const [error, setError] = useState<Error | undefined>(undefined);

    const reload = () => {
        (async () => {
            setIsLoading(true);
            try {
                const response = await getDashboardLabelsData();
                setLabelsOverviews(response);
            } catch (e: any) {
                setError(e);
            }
            setIsLoading(false);
        })();
    };

    useEffect(() => {
        reload();
    }, []);

    return {
        isLoading,
        error,
        reload,
        labelsOverviews,
    };
};
