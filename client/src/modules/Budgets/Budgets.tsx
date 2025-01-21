import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import EditBudgetView from './EditBudgetView';
import SingleBudgetOverViewCard from './SingleBudgetOverViewCard';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import {Backdrop, Box, CircularProgress, IconButton, Typography,} from '@mui/material';

import {useBudgetOverviews} from '../app/hooks/useBudgetOverviews';
import {useRefreshBudgetOverviews} from './hooks/useRefreshBudgetOverviews';

import {RootState} from '../../store/store';
import Error from '../common/error/Error';

const Budgets = () => {
    useBudgetOverviews();
    const navigate = useNavigate();
    const {budgetOverviews, isLoading, error} = useSelector(
        (state: RootState) => state.budget,
    );

    const [showModifyBudgetDialog, setShowModifyBudgetDialog] =
        useState<boolean>(false);

    const [selectedBudgetId, setSelectedBudgetId] = useState<string | undefined>(
        undefined,
    );

    const {refreshBudgetOverViews} = useRefreshBudgetOverviews();

    const handleCreateBudget = () => {
        setShowModifyBudgetDialog(true);
    };

    const handleEditBudgetClose = (refresh?: boolean) => {
        if (refresh === true) {
            refreshBudgetOverViews();
        }

        setSelectedBudgetId(undefined);
        setShowModifyBudgetDialog(false);
    };

    const handleMoreDetailsClick = (id: string) => {
        navigate('/budgets/'.concat(id));
    };

    if (error !== undefined) {
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
                open={isLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid gray',
                }}
            >
                <Typography variant="h5">Budgets</Typography>
                <Box>
                    <IconButton onClick={handleCreateBudget}>
                        <AddIcon/>
                    </IconButton>
                    <IconButton onClick={refreshBudgetOverViews}>
                        <RefreshIcon/>
                    </IconButton>
                </Box>
            </Box>

            {
                <>
                    {budgetOverviews.length === 0 ? (
                        <Typography variant="subtitle1">No budgets found.</Typography>
                    ) : (
                        budgetOverviews.map((overview) => {
                            return (
                                <SingleBudgetOverViewCard
                                    key={overview.id}
                                    overview={overview}
                                    onClick={() => handleMoreDetailsClick(overview.id)}
                                />
                            );
                        })
                    )}
                </>
            }
            {showModifyBudgetDialog && (
                <EditBudgetView
                    onClose={handleEditBudgetClose}
                    show={showModifyBudgetDialog}
                    budgetId={selectedBudgetId}
                />
            )}
        </>
    );
};

export default Budgets;
