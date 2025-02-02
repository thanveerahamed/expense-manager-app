import React, { useState } from 'react';

import InsertChartIcon from '@mui/icons-material/InsertChart';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Box,
  IconButton,
  LinearProgress,
  SxProps,
  Typography,
} from '@mui/material';

import {
  TimelineFilterProvider,
  useTimelineFilterContext,
} from '../../context/TimelineFilterContext';

import { useAuthorization } from '../app/hooks/useAuthorization';
import { useChartData } from '../common/hooks/useChartData';
import { useTransactionsByDuration } from '../common/hooks/useTransactionsByDuration';

import Chart from '../common/charts/Chart';
import Error from '../common/error/Error';
import TimelineFilter from '../common/filters/TimelineFilter';
import TransactionList from '../common/transactions/TransactionList';

const style: SxProps = {};

const Insights = () => {
  const {
    duration,
    isLoading: monthsLoading,
    selectedView,
    months,
  } = useTimelineFilterContext();
  const { isLoading, transactions, error, reload } = useTransactionsByDuration({
    ...duration,
  });
  const { chartData } = useChartData({
    duration,
    transactions,
    selectedView,
    months,
  });
  const [showChart, setShowChart] = useState<boolean>(true);

  if (error !== undefined) {
    return <Error />;
  }

  return (
    <Box sx={style}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid gray',
          marginBottom: '10px',
        }}
      >
        <Typography variant="h5">Transactions</Typography>
        <Box>
          <IconButton onClick={() => setShowChart(!showChart)}>
            <InsertChartIcon color={showChart ? 'success' : 'action'} />
          </IconButton>
          <IconButton onClick={reload}>
            <RefreshIcon
              sx={
                isLoading || monthsLoading
                  ? {
                      'animation': 'spin 2s linear infinite',
                      '@keyframes spin': {
                        '0%': {
                          transform: 'rotate(-360deg)',
                        },
                        '§q 00%': {
                          transform: 'rotate(0deg)',
                        },
                      },
                    }
                  : {}
              }
            />
          </IconButton>
        </Box>
      </Box>
      <TimelineFilter />

      {showChart && (
        <Box sx={{ marginTop: '10px' }}>
          <Chart
            chartType="area"
            labels={chartData.labels}
            series={chartData.series}
            chartColors={['#ff5656', '#66bb6a']}
          />
        </Box>
      )}

      {(isLoading || monthsLoading) && <LinearProgress color="success" />}

      <TransactionList
        inProgress={isLoading || monthsLoading}
        transactionsByPage={transactions}
        onTransactionUpdated={reload}
      />
    </Box>
  );
};

const InsightsWrapper = () => {
  const { demographics } = useAuthorization();

  return (
    <TimelineFilterProvider user={demographics}>
      <Insights />
    </TimelineFilterProvider>
  );
};

export default InsightsWrapper;
