import React from 'react';
import {useNavigate} from 'react-router-dom';

import {cardContentStyle} from './styles';
import {Services} from '@expense-manager/schema';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    LinearProgress,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Typography,
} from '@mui/material';

import {getBudgetProgress, getBudgetProgressColor, getRemainingAmountString,} from '../../common/budgets';

interface Props {
    budgetOverviews: Services.Budgets.BudgetOverview[];
}

const BudgetsCard = ({budgetOverviews}: Props) => {
    const navigate = useNavigate();

    return (
        <Box>
            <Card sx={{minWidth: '250px'}}>
                <CardHeader
                    title="Budgets"
                    titleTypographyProps={{
                        style: {
                            fontSize: '1.2rem',
                        },
                    }}
                    action={
                        <Button onClick={() => navigate('/budgets')}>View more</Button>
                    }
                />
                <CardContent sx={cardContentStyle}>
                    {budgetOverviews.length === 0 && (
                        <Typography sx={{margin: '20px'}} variant="body1">
                            No budgets created.
                        </Typography>
                    )}
                    <List>
                        {budgetOverviews.map((budget) => {
                            return (
                                <ListItem
                                    key={budget.id}
                                    disablePadding
                                    divider
                                    onClick={() => navigate('/budgets/' + budget.id)}
                                >
                                    <ListItemButton>
                                        <ListItemText
                                            primary={
                                                <>
                                                    <Typography
                                                        variant="overline"
                                                        sx={{
                                                            color: `${getBudgetProgressColor(
                                                                budget.percentage,
                                                            )}.main`,
                                                        }}
                                                    >
                                                        <span>{budget.name}</span>
                                                        <span style={{float: 'right'}}>
                              {getRemainingAmountString(budget)} remain
                            </span>
                                                    </Typography>
                                                </>
                                            }
                                            secondary={
                                                <>
                                                    <LinearProgress
                                                        color={getBudgetProgressColor(budget.percentage)}
                                                        variant="determinate"
                                                        value={getBudgetProgress(budget.percentage)}
                                                    />
                                                </>
                                            }
                                        />
                                    </ListItemButton>
                                </ListItem>
                            );
                        })}
                    </List>
                </CardContent>
            </Card>
        </Box>
    );
};

export default BudgetsCard;
