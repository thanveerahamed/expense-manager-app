import React, {useState} from 'react';
import {useParams} from 'react-router-dom';

import EditBudgetView from './EditBudgetView';
import SingleBudgetOverViewCard from './SingleBudgetOverViewCard';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import {Backdrop, Box, CircularProgress, Typography} from '@mui/material';
import Button from '@mui/material/Button';
import MobileStepper from '@mui/material/MobileStepper';
import moment from 'moment';

import {useBudgetTransactions} from './hooks/useBudgetTransactions';

import {formatDate} from '../../common/helpers';
import Error from '../common/error/Error';
import TransactionList from '../common/transactions/TransactionList';

const dateFormat = 'MMMM Do YYYY';

const BudgetMoreDetails = () => {
    const {budgetId} = useParams();
    const {
        isLoading,
        error,
        months,
        selectedMonth,
        setSelectedMonth,
        transactions,
        isInitialLoading,
        budgetOverview,
        loadBudgetTransactions,
    } = useBudgetTransactions(budgetId);

    const [showModifyBudgetDialog, setShowModifyBudgetDialog] =
        useState<boolean>(false);

    const getActiveStep = () =>
        selectedMonth === undefined
            ? 0
            : months.findIndex(
                (month) =>
                    month.startDate === selectedMonth.startDate &&
                    month.endDate === selectedMonth.endDate,
            );

    const handleNext = () => {
        const nextIndex = getActiveStep() + 1;
        setSelectedMonth(months[nextIndex]);
    };

    const handleBack = () => {
        const nextIndex = getActiveStep() - 1;
        setSelectedMonth(months[nextIndex]);
    };

    const handleTransactionUpdated = () => {
        loadBudgetTransactions();
    };

    const handleEditBudgetClose = (refresh?: boolean) => {
        if (refresh === true) {
            // TODO - refresh
        }
        setShowModifyBudgetDialog(false);
    };

    const handleBudgetClick = () => {
        setShowModifyBudgetDialog(true);
    };

    if (error) {
        return <Error/>;
    }

    return (
        <>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 1000,
                    position: 'absolute',
                }}
                open={isInitialLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Box>
                {budgetOverview && (
                    <SingleBudgetOverViewCard
                        overview={budgetOverview}
                        onClick={() => handleBudgetClick()}
                    />
                )}
                {selectedMonth && (
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            margin: '0 10px',
                        }}
                    >
                        <Typography variant="overline">
                            {selectedMonth.endDate === undefined
                                ? formatDate(moment().format('YYYY-MM-DD'), dateFormat)
                                : formatDate(selectedMonth.endDate, dateFormat)}
                        </Typography>
                        <Typography variant="overline">-</Typography>
                        <Typography variant="overline">
                            {formatDate(selectedMonth.startDate, dateFormat)}
                        </Typography>
                    </Box>
                )}
                <MobileStepper
                    variant="progress"
                    steps={months.length}
                    position="static"
                    activeStep={getActiveStep()}
                    sx={{maxWidth: 400, flexGrow: 1}}
                    nextButton={
                        <Button
                            size="small"
                            onClick={handleNext}
                            disabled={getActiveStep() === months.length - 1}
                        >
                            Next
                            <KeyboardArrowRight/>
                        </Button>
                    }
                    backButton={
                        <Button
                            size="small"
                            onClick={handleBack}
                            disabled={getActiveStep() === 0}
                        >
                            <KeyboardArrowLeft/>
                            Back
                        </Button>
                    }
                />

                <Box>
                    <Backdrop
                        sx={{
                            color: '#fff',
                            zIndex: (theme) => theme.zIndex.modal + 1000,
                            position: 'absolute',
                        }}
                        open={isLoading}
                    >
                        <CircularProgress color="inherit"/>
                    </Backdrop>
                    <Box>
                        <TransactionList
                            inProgress={isLoading}
                            transactionsByPage={transactions}
                            onTransactionUpdated={handleTransactionUpdated}
                        />
                    </Box>
                </Box>
            </Box>
            {showModifyBudgetDialog && (
                <EditBudgetView
                    onClose={handleEditBudgetClose}
                    show={showModifyBudgetDialog}
                    budgetId={budgetId}
                />
            )}
        </>
    );
};

export default BudgetMoreDetails;
