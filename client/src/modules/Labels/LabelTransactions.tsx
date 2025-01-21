import {useEffect, useState} from 'react';
import {useParams, useSearchParams} from 'react-router-dom';

import {Dayjs} from 'dayjs';

import {useTransactionsByDuration} from '../common/hooks/useTransactionsByDuration';

import {dayjs} from '../../common/helpers/dayJs';
import TransactionList from '../common/transactions/TransactionList';

export default function LabelTransactions() {
    const {labelId} = useParams();
    const [searchParams] = useSearchParams();

    const [startDate, setStartDate] = useState<Dayjs>();
    const [endDate, setEndDate] = useState<Dayjs>();

    const {transactions, isLoading, reload} = useTransactionsByDuration({
        startDate,
        endDate,
        labelId,
    });

    useEffect(() => {
        if (searchParams.get('startDate')) {
            setStartDate(dayjs(searchParams.get('startDate'), 'YYYY-MM-DD'));
        }

        if (searchParams.get('endDate')) {
            setEndDate(dayjs(searchParams.get('endDate'), 'YYYY-MM-DD'));
        }
    }, [searchParams]);

    return (
        <TransactionList
            onTransactionUpdated={reload}
            transactionsByPage={transactions}
            inProgress={isLoading}
        />
    );
}
