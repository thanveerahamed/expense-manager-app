import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import Categories from './Categories';
import { Box, Tab, Tabs } from '@mui/material';

import { RootState } from '../../store/store';
import BuildingBlocks from '../common/Loader/BuildingBlocks';

const CategoryTabView = () => {
  const { categories, isLoading, error } = useSelector(
    (state: RootState) => state.category,
  );
  const [selectedTab, setSelectedTab] = useState<string>('debit');
  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setSelectedTab(newValue);
  };

  if (isLoading) {
    return <BuildingBlocks />;
  }

  if (error) {
    return <>Some error occurred</>;
  }

  return (
    <Box>
      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Debit" value={'debit'} />
        <Tab label="Credit" value={'credit'} />
      </Tabs>
      {
        <Categories
          categories={categories.filter(
            (category) => category.type === selectedTab,
          )}
        />
      }
    </Box>
  );
};

export default CategoryTabView;
