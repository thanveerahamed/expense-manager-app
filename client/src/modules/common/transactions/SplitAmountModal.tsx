import React, { useState } from 'react';
import { toast } from 'react-toastify';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Backdrop,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  IconButton,
  Stack,
  TextField,
} from '@mui/material';
import Alert from '@mui/material/Alert';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { nanoid } from 'nanoid';

import { splitTransaction } from '../../../providers';
import TransitionLeft from '../transitions/TransitionLeft';

interface Props {
  open: boolean;
  transactionAmount: string;
  onClose: () => void;
  transactionId: string;
}

const getPositiveAmount = (amount: string) => {
  return (parseFloat(amount) * -1).toFixed(2);
};

export const getAmountString = (amount: number): string =>
  `${(amount / 10 ** 2).toFixed(2).toString()}`;

const SplitAmountModal = ({
  open,
  transactionAmount,
  onClose,
  transactionId,
}: Props) => {
  const positiveAmount = getPositiveAmount(transactionAmount);
  const [loading, setLoading] = useState<boolean>(false);

  const [splits, setSplits] = useState([
    { id: nanoid(), amount: '' },
    { id: nanoid(), amount: '' },
  ]);

  const currentTotal = splits.reduce(
    (sum, split) => sum + (parseFloat(split.amount) || 0),
    0,
  );
  const remaining = positiveAmount
    ? (parseFloat(positiveAmount) - currentTotal).toFixed(2)
    : '0.00';
  const isOverspent = parseFloat(remaining) < 0;
  const isFullyAllocated = parseFloat(remaining) === 0 && positiveAmount !== '';

  const addSplit = () => {
    setSplits([...splits, { id: nanoid(), amount: '' }]);
  };

  const removeSplit = (id: string) => {
    if (splits.length > 2) {
      setSplits(splits.filter((split) => split.id !== id));
    }
  };

  const updateSplit = (id: string, value: string) => {
    setSplits(
      splits.map((split) => {
        if (split.id === id) {
          return { ...split, amount: value };
        }
        return split;
      }),
    );
  };

  const splitEvenly = () => {
    if (!positiveAmount) return;
    const evenAmount = (parseFloat(positiveAmount) / splits.length).toFixed(2);
    let totalEvenAmount = (parseFloat(evenAmount) * splits.length).toFixed(2);

    if (parseFloat(totalEvenAmount) !== parseFloat(positiveAmount)) {
      const difference = (
        parseFloat(positiveAmount) - parseFloat(totalEvenAmount)
      ).toFixed(2);
      splits[splits.length - 1].amount = (
        parseFloat(evenAmount) + parseFloat(difference)
      ).toFixed(2);
    }

    setSplits(
      splits.map((split, index) => ({
        ...split,
        amount:
          index === splits.length - 1
            ? splits[splits.length - 1].amount
            : evenAmount,
      })),
    );
  };

  const handleSave = () => {
    (async () => {
      setLoading(true);
      try {
        await splitTransaction({
          transactionId,
          amounts: splits.map((split) => parseFloat(split.amount) * -1),
        });
        onClose();
      } catch (error: any) {
        toast('Error occurred.');
      }
      setLoading(false);
    })();
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={open}
        fullScreen
        onClose={() => onClose()}
        TransitionComponent={TransitionLeft}
      >
        <AppBar sx={{ position: 'sticky' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => onClose()}
              aria-label="close"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Split transaction
            </Typography>
            <Button
              color="secondary"
              onClick={handleSave}
              disabled={!isFullyAllocated}
            >
              Split
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ margin: '20px 5px' }}>
          <Stack direction="row" spacing={2} mb="20px">
            <Button variant="contained" color="success" onClick={splitEvenly}>
              Split evenly
            </Button>
            <Button variant="outlined" color="success" onClick={addSplit}>
              Add split
            </Button>
          </Stack>
          {splits.map((split, index) => (
            <Stack direction="row" alignItems="center" key={split.id}>
              <TextField
                sx={{ mb: 2 }}
                fullWidth
                required
                id="outlined-amount"
                label={`Split ${index + 1}`}
                type="number"
                onChange={(e) => updateSplit(split.id, e.target.value)}
                value={split.amount}
              />
              {splits.length > 2 && (
                <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => removeSplit(split.id)}
                  color="error"
                >
                  <DeleteIcon fontSize="inherit" />
                </IconButton>
              )}
            </Stack>
          ))}

          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Total Amount:</Typography>
                <Typography>€ {positiveAmount || '0.00'}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Allocated::</Typography>
                <Typography>€ {currentTotal.toFixed(2)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography>Remaining::</Typography>
                <Typography color={isOverspent ? 'red' : 'inherit'}>
                  € {remaining}
                </Typography>
              </Stack>
              {isFullyAllocated && (
                <Alert
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                >
                  Amount fully allocated
                </Alert>
              )}
            </CardContent>
          </Card>
        </Box>
      </Dialog>
    </>
  );
};

export default SplitAmountModal;
