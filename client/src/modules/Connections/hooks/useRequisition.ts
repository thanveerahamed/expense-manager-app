import {useState} from 'react';
import {toast} from 'react-toastify';

import {Collections} from '@expense-manager/schema';

import {storeNordigenReference} from '../../../common/storage';
import {createRequisition as createRequisitionUtility} from '../../../providers/bankingProvider';

interface Props {
    institution?: Collections.BankingApi.Institution;
}

export const useRequisition = ({institution}: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<Error | undefined>(undefined);

    const createRequisition = async (): Promise<void> => {
        if (institution === undefined) {
            return;
        }

        setIsLoading(true);
        try {
            const requisition = await createRequisitionUtility({
                institution: {
                    ...institution,
                    ///id: "SANDBOXFINANCE_SFIN0000",
                },
                redirectUrl: `${window.location.href}/result`,
            });

            storeNordigenReference(requisition.reference);

            window.location.href = requisition.link;
        } catch (error: any) {
            toast('Unable to create requisition. Please try again later', {
                type: 'error',
            });
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        createRequisition,
    };
};
