import React from 'react';
import {useNavigate} from 'react-router-dom';

import {cardContentStyle} from './styles';
import {Services} from '@expense-manager/schema';
import {Box, Button, Card, CardContent, CardHeader, List,} from '@mui/material';

import TransactionItem from '../common/transactions/TransactionItem';

interface Props {
    transactions: Services.Transactions.Transaction[];
}

const LatestTransactionsCard = ({transactions}: Props) => {
    const navigate = useNavigate();

    return (
        <Box>
            <Card sx={{minWidth: '250px'}}>
                <CardHeader
                    title="Latest transactions"
                    titleTypographyProps={{
                        style: {
                            fontSize: '1.2rem',
                        },
                    }}
                    action={
                        <Button onClick={() => navigate('/transactions')}>View more</Button>
                    }
                />
                <CardContent sx={cardContentStyle}>
                    <List>
                        {transactions.map((transaction) => {
                            return (
                                <TransactionItem
                                    key={transaction.id}
                                    onClick={() => navigate(`/transactions/${transaction.id}`)}
                                    transaction={transaction}
                                />
                            );
                        })}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LatestTransactionsCard;
