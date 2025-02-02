import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

import { Collections, Services } from '@expense-manager/schema';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { useCategories } from '../../app/hooks/useCategories';

import { assignCategory } from '../../../providers';
import { RootState } from '../../../store/store';
import Categories from '../../Categories/Categories';
import { BaseCategory } from '../../Categories/types';
import Error from '../error/Error';
import TransitionLeft from '../transitions/TransitionLeft';

interface Props {
  transactionId: string;
  type: Collections.Transactions.TransactionType;
  onClose: (transaction?: Services.Transactions.Transaction) => void;
  categoryId: string;
}

const CategoriesScreen = ({
  transactionId,
  type,
  onClose,
  categoryId,
}: Props) => {
  useCategories();
  const { categories, isLoading, error } = useSelector(
    (state: RootState) => state.category,
  );
  const [selectedCategoryId, setSelectedCategoryId] =
    useState<string>(categoryId);
  const [loading, setLoading] = useState<boolean>(false);

  const handleBackClick = () => {
    onClose(undefined);
  };

  const handleSaveCategory = () => {
    (async () => {
      setLoading(true);
      try {
        const updatedTransaction = await assignCategory({
          transactionId,
          categoryId: selectedCategoryId,
        });
        onClose(updatedTransaction);
      } catch (error: any) {
        console.error(error);
        toast('Error while assigning category.', { type: 'error' });
      }
      setLoading(false);
    })();
  };

  const handleCategorySelected = (category: BaseCategory) => {
    if (category.id !== undefined) setSelectedCategoryId(category.id);
  };

  const currentTypeCategories = categories.filter(
    (category) => category.type === type,
  );

  if (error) {
    return <Error />;
  }

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={loading || isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        fullScreen
        open={true}
        onClose={handleBackClick}
        TransitionComponent={TransitionLeft}
      >
        <AppBar sx={{ position: 'sticky' }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleBackClick}
              aria-label="close"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Category
            </Typography>
            <Button
              color="success"
              onClick={handleSaveCategory}
              disabled={categoryId === selectedCategoryId}
            >
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ margin: '10px 5px' }}>
          <Categories
            categories={currentTypeCategories}
            selectedCategoryId={selectedCategoryId}
            onCategorySelected={handleCategorySelected}
          />
        </Box>
      </Dialog>
    </>
  );
};

export default CategoriesScreen;
