import React from 'react';

import {Shared} from '@expense-manager/schema';
import {Card, CardHeader, Typography} from '@mui/material';

import {formatAmountWithCurrency} from '../../common/money';

interface Props {
    accountBalance: Shared.Money.Money;
}

const AccountBalance = ({accountBalance: {amount, currency}}: Props) => {
    return (
        <Card sx={{minWidth: '250px'}}>
            <CardHeader
                title="Account Balance"
                titleTypographyProps={{
                    style: {
                        fontSize: '1.2rem',
                    },
                }}
                action={
                    <Typography variant="h6">
                        {formatAmountWithCurrency(currency, amount)}
                    </Typography>
                }
            />
        </Card>
    );
};

export default AccountBalance;
