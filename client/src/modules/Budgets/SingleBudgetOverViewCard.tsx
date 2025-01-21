import React from 'react';

import {Services} from '@expense-manager/schema';
import {Card, CardContent, CardHeader, Chip, LinearProgress,} from '@mui/material';

import {
    getBudgetProgress,
    getBudgetProgressColor,
    getRemainingAmount,
    getRemainingAmountString,
    getTotalAmountString,
} from '../../common/budgets';

interface Props {
    overview: Services.Budgets.BudgetOverview;
    onClick: () => void;
}

const SingleBudgetOverViewCard = ({overview, onClick}: Props) => {
    const getRemainingAmountInformation = () => {
        const remainingAmount = getRemainingAmount(overview);

        const remainText = remainingAmount >= 0 ? 'remain' : 'consumed';

        return `${getRemainingAmountString(overview)} of ${getTotalAmountString(
            overview,
        )} ${remainText}`;
    };
    return (
        <Card sx={{marginTop: '10px', marginBottom: '10px'}} onClick={onClick}>
            <CardHeader
                action={
                    <Chip
                        label={getRemainingAmountInformation()}
                        color={getBudgetProgressColor(overview.percentage)}
                    />
                }
                title={overview.name}
                titleTypographyProps={{
                    style: {
                        fontSize: '1rem',
                    },
                }}
            />
            <CardContent>
                <LinearProgress
                    sx={{height: '10px'}}
                    color={getBudgetProgressColor(overview.percentage)}
                    variant="determinate"
                    value={getBudgetProgress(overview.percentage)}
                />
            </CardContent>
        </Card>
    );
};

export default SingleBudgetOverViewCard;
