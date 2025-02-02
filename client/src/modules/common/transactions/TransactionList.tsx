import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import TransactionItem from './TransactionItem';
import { getTransactionsByDate } from './helper';
import { Services } from '@expense-manager/schema';
import { Box, List, ListSubheader, SxProps } from '@mui/material';

import { formatDateWithToday } from '../../../common/helpers';
import { formatAmountWithCurrency } from '../../../common/money';

interface Props {
  onTransactionUpdated: (
    transaction: Services.Transactions.Transaction,
  ) => void;
  transactionsByPage: Services.Transactions.Transaction[];
  inProgress: boolean;
}

const subheaderStyle: SxProps = {
  background: 'inherit',
  borderBottom: '1px #757575 solid',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
};

const TransactionList = ({
  onTransactionUpdated,
  transactionsByPage,
  inProgress,
}: Props) => {
  const navigate = useNavigate();
  const transactionsByDate = useMemo(
    () => getTransactionsByDate(transactionsByPage),
    [transactionsByPage],
  );

  if (inProgress && transactionsByDate.length === 0) {
    return <>Loading...</>;
  }

  return (
    <>
      {transactionsByDate.length === 0 ? (
        <>No transactions found.</>
      ) : (
        transactionsByDate.map((transactionByDate) => {
          return (
            <List
              key={transactionByDate.date}
              subheader={
                <ListSubheader
                  component="div"
                  id="daily-expense-subheader"
                  sx={subheaderStyle}
                >
                  <Box sx={{ fontWeight: 'bold' }}>
                    {formatDateWithToday(transactionByDate.date)}
                  </Box>
                  <Box
                    sx={{
                      color:
                        transactionByDate.amountSpent > 0
                          ? 'success.main'
                          : 'error.main',
                    }}
                  >
                    {formatAmountWithCurrency(
                      transactionByDate.currency,
                      transactionByDate.amountSpent.toFixed(2),
                    )}
                  </Box>
                </ListSubheader>
              }
            >
              {transactionByDate.transactions.map((transaction) => {
                return (
                  <TransactionItem
                    key={transaction.id}
                    onClick={() => navigate(`/transactions/${transaction.id}`)}
                    transaction={transaction}
                  />
                );
              })}
            </List>
          );
        })
      )}
    </>
  );
};

export default TransactionList;
