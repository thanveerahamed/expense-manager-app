import {Collections, Services} from '@expense-manager/schema';
import {Dayjs} from 'dayjs';

import {apiGet, apiPost, apiPut} from '../common';
import {HOST_URL} from '../common/constants';

const transactionsUrl = `${HOST_URL}/transactions`;

export const getTransactions = async ({
                                          nextPageToken,
                                      }: {
    nextPageToken?: string;
}): Promise<Services.Transactions.GetTransactionsResponse> => {
    const getAllTransactions = `${transactionsUrl}/all`;
    return apiPost<Services.Transactions.GetTransactionsResponse>(
        getAllTransactions,
        {nextPageToken},
    );
};

export const assignLabels = async ({
                                       transactionId,
                                       labels,
                                   }: {
    transactionId: string;
    labels: Collections.Transactions.TransactionLabel[];
}): Promise<Services.Transactions.Transaction> => {
    const assignLabelsUrl = `${transactionsUrl}/labels/assign`;
    return apiPost<Services.Transactions.Transaction>(assignLabelsUrl, {
        transactionId,
        labels,
    });
};

export const unAssignLabel = async ({
                                        transactionId,
                                        label,
                                    }: {
    transactionId: string;
    label: Collections.Transactions.TransactionLabel;
}): Promise<Services.Transactions.Transaction> => {
    const unAssignLabelUrl = `${transactionsUrl}/labels/remove`;
    return apiPost<Services.Transactions.Transaction>(unAssignLabelUrl, {
        transactionId,
        label,
    });
};

export const getTransactionById = async ({
                                             transactionId,
                                         }: {
    transactionId: string;
}): Promise<Services.Transactions.Transaction> => {
    const assignLabelsUrl = `${transactionsUrl}/${transactionId}`;
    return apiGet<Services.Transactions.Transaction>(assignLabelsUrl);
};

export const assignCategory = async ({
                                         transactionId,
                                         categoryId,
                                     }: {
    transactionId: string;
    categoryId: string;
}): Promise<Services.Transactions.Transaction> => {
    const assignLabelsUrl = `${transactionsUrl}/${transactionId}/category/assign/${categoryId}`;
    return apiPut<Services.Transactions.Transaction>(assignLabelsUrl, {});
};

export const getTransactionsUntil = async ({
                                               transactionId,
                                           }: {
    transactionId: string;
}): Promise<Services.Transactions.Transaction[]> => {
    const getTransactionUntilUrl = `${transactionsUrl}/until/${transactionId}`;
    return apiGet<Services.Transactions.Transaction[]>(getTransactionUntilUrl);
};

export const updateVendorName = async ({
                                           transactionId,
                                           name,
                                       }: {
    transactionId: string;
    name: string;
}): Promise<Services.Transactions.Transaction> => {
    const updateVendorNameUrl = `${transactionsUrl}/${transactionId}/name`;
    return apiPut<Services.Transactions.Transaction>(updateVendorNameUrl, {
        name,
    });
};

export const updateNote = async ({
                                     transactionId,
                                     note,
                                 }: {
    transactionId: string;
    note: string;
}): Promise<Services.Transactions.Transaction> => {
    const updateVendorNameUrl = `${transactionsUrl}/${transactionId}/note`;
    return apiPut<Services.Transactions.Transaction>(updateVendorNameUrl, {
        note,
    });
};

export const splitTransaction = async ({
                                           transactionId,
                                           amounts,
                                       }: {
    transactionId: string;
    amounts: number[];
}): Promise<Services.Transactions.Transaction> => {
    const splitAmountUrl = `${transactionsUrl}/${transactionId}/split`;
    return apiPut<Services.Transactions.Transaction>(splitAmountUrl, {
        amounts,
    });
};

export const getTransactionsByDuration = async ({
                                                    startDate,
                                                    endDate,
                                                    labelId,
                                                }: {
    startDate: Dayjs;
    endDate: Dayjs;
    labelId?: string;
}): Promise<Services.Transactions.GetTransactionsResponse['transactions']> => {
    return apiGet<Services.Transactions.GetTransactionsResponse['transactions']>(
        transactionsUrl,
        {
            startDate: startDate.format('YYYY-MM-DD'),
            endDate: endDate.format('YYYY-MM-DD'),
            ...(labelId ? {labelId} : {}),
        },
    );
};
