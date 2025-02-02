import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { Services } from '@expense-manager/schema';
import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
} from '@mui/material';

import { updateVendorName } from '../../../providers/transactionsProvider';

interface Props {
  open: boolean;
  transactionName: string;
  onClose: (transaction?: Services.Transactions.Transaction) => void;
  transactionId: string;
}

const EditNameModal = ({
  open,
  transactionName,
  onClose,
  transactionId,
}: Props) => {
  const [name, setName] = useState<string>(transactionName);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = () => {
    (async () => {
      setLoading(true);
      try {
        const transaction = await updateVendorName({ transactionId, name });
        onClose(transaction);
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
      <Dialog open={open}>
        <DialogTitle>Name</DialogTitle>
        <DialogContent>
          <TextareaAutosize
            aria-label="name textarea"
            placeholder="Name"
            minRows={3}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '300px' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()} color={'error'}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            color="success"
            disabled={name === transactionName}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditNameModal;
