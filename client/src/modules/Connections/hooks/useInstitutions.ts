import {useEffect, useState} from 'react';

import {Collections} from '@expense-manager/schema';

import {getInstitutions} from '../../../providers/bankingProvider';

export const useInstitutions = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | undefined>(undefined);
    const [institutions, setInstitutions] = useState<
        Collections.BankingApi.Institution[]
    >([]);
    useEffect(() => {
        (async () => {
            try {
                setIsLoading(true);
                const response = await getInstitutions();
                setInstitutions(response);
            } catch (error: any) {
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        })();
    }, []);

    return {
        isLoading,
        institutions,
        error,
    };
};
