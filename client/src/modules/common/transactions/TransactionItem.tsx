import React, { Fragment } from 'react';

import TransactionItemDescription from './TransactionItemDescription';
import { Services } from '@expense-manager/schema';
import {
  Chip,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Typography,
} from '@mui/material';

import { formatAmountWithCurrency } from '../../../common/money';
import { CategoriesAvatar } from '../categories';

interface Props {
  onClick: () => void;
  transaction: Services.Transactions.Transaction;
}

const TransactionItem = ({ onClick, transaction }: Props) => {
  return (
    <Fragment>
      <ListItem disablePadding onClick={onClick}>
        <ListItemButton sx={{ width: '200px' }}>
          <ListItemAvatar>
            <CategoriesAvatar
              name={transaction.category.parentName}
              type={transaction.type}
            />
          </ListItemAvatar>
          <TransactionItemDescription
            name={transaction.name}
            category={transaction.category.name}
            parentCategory={transaction.category.parentName}
            notes={transaction.notes}
          />
        </ListItemButton>
        <span style={{ marginRight: '5px', textAlign: 'right' }}>
          <Typography variant="h6">
            {formatAmountWithCurrency(transaction.currency, transaction.amount)}
          </Typography>
          {transaction.labels?.length !== undefined &&
            transaction.labels?.length > 0 && (
              <Chip
                size="small"
                color="success"
                variant="outlined"
                label={
                  transaction.labels?.length === 1
                    ? transaction.labels[0].name
                    : `${transaction.labels[0].name} & +`
                }
              />
            )}
        </span>
      </ListItem>

      <Divider variant="inset" component="li" />
    </Fragment>
  );
};

export default TransactionItem;
