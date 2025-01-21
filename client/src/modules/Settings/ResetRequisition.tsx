import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import {toast} from 'react-toastify';

import LoadingButton from '@mui/lab/LoadingButton';

import {attemptRequisition, confirmRequisition,} from '../../providers/bankingProvider';

export default function ResetRequisition() {
    console.log('location', window.location.href);

    const [searchParams] = useSearchParams();
    const ref = searchParams.get('ref');

    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        const baseUrl = `${window.location.origin}${window.location.pathname}`;
        const fullUrl = `${baseUrl}?fromRedirect=true`;

        setIsLoading(true);
        try {
            const requisition = await attemptRequisition(fullUrl);
            window.location.href = requisition.redirectLink;
        } catch (error: any) {
            toast('Unable to create requisition. Please try again later', {
                type: 'error',
            });
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (ref) {
            setIsLoading(true);

            (async () => {
                try {
                    await confirmRequisition(ref);
                    window.location.href = `${window.location.origin}/`;
                } catch (error: any) {
                    toast('Unable to create requisition. Please try again later', {
                        type: 'error',
                    });
                    setIsLoading(false);
                }
            })();
        }
    }, [ref]);

    return (
        <LoadingButton loading={isLoading} onClick={handleClick}>
            Request requisition
        </LoadingButton>
    );
}
