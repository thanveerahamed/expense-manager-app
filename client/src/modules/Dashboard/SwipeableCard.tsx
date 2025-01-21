import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import React from 'react';
import {useNavigate} from 'react-router-dom';

import DoneIcon from '@mui/icons-material/Done';
import LoadingButton from '@mui/lab/LoadingButton';
import {Box, Button, Card, CardContent, Skeleton, Stack, Typography,} from '@mui/material';

import {formatDate} from '../../common/helpers';
import {formatAmountWithCurrency} from '../../common/money';
import {getDashboardNewTransactions, setTransactionToOld,} from '../../providers';

export default function SwipeableCard() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {data, isLoading} = useQuery({
        queryKey: ['new-transactions'],
        queryFn: async () => {
            return await getDashboardNewTransactions();
        },
    });

    const {
        mutate: setTransactionOldMutate,
        isPending: setTransactionOldMutateInProgress,
    } = useMutation({
        mutationFn: setTransactionToOld,
        onSuccess: async () => {
            await queryClient.invalidateQueries({queryKey: ['new-transactions']});
        },
    });

    if (isLoading) {
        return <LoadingSkeleton/>;
    }

    if (data === undefined || data?.length === 0) {
        return null;
    }

    const transaction = data[0];

    const handleDone = async () => {
        setTransactionOldMutate(transaction.id);
    };

    return (
        <Card variant="outlined">
            <CardContent sx={{padding: '10px'}}>
                <Typography gutterBottom sx={{color: 'text.secondary', fontSize: 14}}>
                    {transaction.name}
                </Typography>
                <Stack direction="row" justifyContent={'space-between'}>
                    <Box>
                        <Typography variant="h5" component="div">
                            {formatAmountWithCurrency(
                                transaction.currency,
                                transaction.amount,
                            )}
                        </Typography>
                        <Typography sx={{color: 'text.secondary', mb: 1.5}}>
                            {formatDate(transaction.bookingDate, 'DD MMM YYYY')}
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="body2">
                            {transaction.category.parentName}
                        </Typography>
                        <Typography variant="caption">
                            {transaction.category.name}
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction="row" justifyContent={'space-between'}>
                    <Button
                        size="small"
                        onClick={() => navigate(`/transactions/${transaction.id}`)}
                    >
                        EDIT
                    </Button>
                    <Box sx={{marginLeft: 'auto'}}>
                        <LoadingButton
                            size="small"
                            color="success"
                            startIcon={<DoneIcon/>}
                            loading={setTransactionOldMutateInProgress}
                            onClick={handleDone}
                        >
                            DONE
                        </LoadingButton>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
}

function LoadingSkeleton() {
    return (
        <>
            <Skeleton variant="rectangular" height={118}/>
            <br/>
            <Skeleton variant="rectangular" height={20} width={'20%'}/>
        </>
    );
}
