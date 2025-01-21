import {Collections} from '@expense-manager/schema';

import {apiGet, apiPost} from '../common';
import {HOST_URL} from '../common/constants';

const bankingUrl = `${HOST_URL}/banking`;
export const getInstitutions = (countryCode: string = 'nl') => {
    const getInstitutions = `${bankingUrl}/institutions/${countryCode}`;

    return apiGet<Collections.BankingApi.Institution[]>(getInstitutions);
};

export const createRequisition = ({
                                      institution,
                                      redirectUrl,
                                  }: {
    institution: Collections.BankingApi.Institution;
    redirectUrl: string;
}) => {
    const createRequisition = `${bankingUrl}/requisition`;
    return apiPost<Collections.BankingApi.CreateRequisitionResponse>(
        createRequisition,
        {institution, redirectUrl},
    );
};

export const setRequisitionToFailed = () => {
    const createRequisition = `${bankingUrl}/requisition/update/status`;
    return apiPost<{ success: boolean }>(createRequisition, {failed: true});
};

export const attemptRequisition = (redirectUrl: string) => {
    const attemptRequisitionUrl = `${bankingUrl}/requisition/attempt`;
    return apiPost<{ redirectLink: string; reference: string }>(
        attemptRequisitionUrl,
        {redirectUrl},
    );
};

export const confirmRequisition = (reference: string) => {
    const attemptRequisitionUrl = `${bankingUrl}/requisition/attempt-success`;
    return apiPost<{ redirectLink: string; reference: string }>(
        attemptRequisitionUrl,
        {reference},
    );
};
