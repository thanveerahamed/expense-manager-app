import {useEffect, useState} from 'react';
import {toast} from 'react-toastify';

import {LabelWithId} from '../../../../common/types/labels';
import {addLabel, getAllLabels} from '../../../../providers/labelProvider';

const useLabels = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [labels, setLabels] = useState<LabelWithId[]>([]);
    const [error, setError] = useState<any>(undefined);

    const addNewLabel = (name: string): void => {
        (async () => {
            try {
                const updatedLabels = await addLabel(name);
                setLabels(updatedLabels);
            } catch (e: any) {
                toast('Unable to add the label. Try again later');
            }
        })();
    };

    useEffect(() => {
        (async () => {
            try {
                const allLabels = await getAllLabels();
                setLabels(allLabels);
            } catch (e: any) {
                setError(e);
            }

            setIsLoading(false);
        })();
    }, []);

    return {isLoading, labels, error, addNewLabel};
};

export default useLabels;
