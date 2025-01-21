import {useSelector} from 'react-redux';
import {useNavigate} from 'react-router-dom';

import AccountBalance from './AccountBalance';
import BudgetsCard from './BudgetsCard';
import LabelsCard from './LabelsCard';
import LatestTransactionsCard from './LatestTransactionsCard';
import LoadingSkeleton from './LoadingSkeleton';
import SwipeableCard from './SwipeableCard';
import {Collections} from '@expense-manager/schema';
import {Alert, AlertColor, Box, Button, List, ListItem, ListItemText,} from '@mui/material';
import Typography from '@mui/material/Typography';

import {useDashboardData} from './hooks/useDashboardData';
import {useDashboardLabelsData} from './hooks/useDashboardLabelsData';

import {RootState} from '../../store/store';
import Error from '../common/error/Error';

const getAlertSeverity = (
    jobStatus: Collections.SyncTransactionsJobs.SyncTransactionsJobStatus,
): AlertColor => {
    if (
        jobStatus ===
        Collections.SyncTransactionsJobs.SyncTransactionsJobStatus.FAILED
    ) {
        return 'error';
    } else if (
        jobStatus ===
        Collections.SyncTransactionsJobs.SyncTransactionsJobStatus.QUEUED
    ) {
        return 'info';
    }

    return 'success';
};

const Dashboard = () => {
    const navigate = useNavigate();
    const {demographics} = useSelector((state: RootState) => state.user);
    const {
        transactions,
        overviews,
        isLoading,
        error,
        accountBalance,
        lastSyncTransactionJob,
    } = useDashboardData();
    const {
        isLoading: labelsOverviewLoading,
        labelsOverviews,
        error: labelsOverviewError,
    } = useDashboardLabelsData();

    if (error !== undefined) {
        return <Error/>;
    }

    return (
        <Box sx={{margin: '20px 10px'}}>
            {demographics && (
                <List>
                    <ListItem>
                        <ListItemText>
                            <Typography variant="button">
                                Welcome {demographics.name} 👋
                            </Typography>
                        </ListItemText>
                    </ListItem>
                </List>
            )}
            {isLoading ? (
                <>
                    <LoadingSkeleton/>
                    <br/>
                    <LoadingSkeleton/>
                </>
            ) : (
                <>
                    {lastSyncTransactionJob !== undefined &&
                        lastSyncTransactionJob.status !==
                        Collections.SyncTransactionsJobs.SyncTransactionsJobStatus
                            .COMPLETED && (
                            <>
                                <Alert
                                    variant="outlined"
                                    severity={getAlertSeverity(lastSyncTransactionJob.status)}
                                    action={
                                        <Button
                                            color="inherit"
                                            size="small"
                                            onClick={() => navigate('/sync-transaction-jobs')}
                                        >
                                            TAKE ME
                                        </Button>
                                    }
                                >
                                    The status of the last sync job:{' '}
                                    {lastSyncTransactionJob.status}
                                </Alert>
                                <br/>
                            </>
                        )}
                    <SwipeableCard/>
                    <br/>
                    <AccountBalance accountBalance={accountBalance}/>
                    <br/>
                    <LatestTransactionsCard transactions={transactions}/>
                    <br/>
                    <BudgetsCard budgetOverviews={overviews}/>
                    <br/>
                    <LabelsCard
                        labelsOverviews={labelsOverviews.slice(0, 5)}
                        loading={labelsOverviewLoading}
                        error={labelsOverviewError}
                    />
                </>
            )}
        </Box>
    );
};

export default Dashboard;
