import React from 'react';
import { useSelector } from 'react-redux';

import Loading from './Loading';
import RefreshIcon from '@mui/icons-material/Refresh';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, IconButton, SxProps, Typography } from '@mui/material';

import { useTransactions } from '../app/hooks/useTransactions';
import { useTransactionUpdate } from '../common/transactions/hooks/useTransactionUpdate';

import { RootState } from '../../store/store';
import Error from '../common/error/Error';
import TransactionList from '../common/transactions/TransactionList';

const style: SxProps = {};

const Transactions = () => {
  const { refreshLoadedTransactions } = useTransactionUpdate();
  const {
    transactions: transactionsByPage,
    isLoading,
    hasMore,
    error,
    refreshLoading,
    viewMoreLoading,
  } = useSelector((state: RootState) => state.transaction);

  const { getNextPageData } = useTransactions();

  if (error !== undefined) {
    return <Error />;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={style}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid gray',
        }}
      >
        <Typography variant="h5">Transactions</Typography>
        <Box>
          <IconButton onClick={refreshLoadedTransactions}>
            <RefreshIcon
              sx={
                refreshLoading
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
      <TransactionList
        inProgress={isLoading}
        transactionsByPage={transactionsByPage}
        onTransactionUpdated={refreshLoadedTransactions}
      />
      {hasMore && (
        <LoadingButton
          size="small"
          onClick={() => getNextPageData()}
          loading={viewMoreLoading}
          loadingIndicator="Loading…"
          variant="outlined"
          sx={{ marginBottom: '10px' }}
          fullWidth
        >
          View more
        </LoadingButton>
      )}
    </Box>
  );
};

export default Transactions;
