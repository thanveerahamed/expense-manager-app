import React, { useState } from 'react';

import CategoryChildrenView from './CategoryChildrenView';
import { BaseCategory, OrderedCategory } from './types';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {
  Box,
  Collapse,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';

import CategoriesAvatar from '../common/categories/CategoriesAvatar';

interface Props {
  categories: OrderedCategory[];
  selectedCategoryId?: string;
  onCategorySelected?: (category: BaseCategory) => void;
}

const Categories = ({
  categories,
  selectedCategoryId,
  onCategorySelected,
}: Props) => {
  const [openedParent, setOpenedParent] = useState<OrderedCategory | undefined>(
    categories.find(
      (category) =>
        category.children.filter((child) => child.id === selectedCategoryId)
          .length > 0,
    ),
  );

  const handleParentCategoryClick = (selected: OrderedCategory) => {
    if (selected.name !== openedParent?.name) {
      setOpenedParent(selected);
    } else {
      setOpenedParent(undefined);
    }
  };

  const handleCategorySelected = (category: BaseCategory) => {
    if (onCategorySelected !== undefined) onCategorySelected(category);
  };

  return (
    <Box>
      {categories.map((category) => {
        return (
          <List key={category.name}>
            <ListItemButton
              divider
              onClick={() => handleParentCategoryClick(category)}
            >
              <ListItemAvatar>
                <CategoriesAvatar type={category.type} name={category.name} />
              </ListItemAvatar>
              <ListItemText primary={category.name} />
              <>
                {openedParent !== undefined &&
                category.name === openedParent.name ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )}
              </>
            </ListItemButton>
            <Collapse
              in={
                openedParent !== undefined &&
                category.name === openedParent.name
              }
              timeout="auto"
              unmountOnExit
            >
              <CategoryChildrenView
                categories={
                  openedParent === undefined ? [] : openedParent.children
                }
                selectedCategoryId={selectedCategoryId}
                onCategorySelected={handleCategorySelected}
              />
            </Collapse>
          </List>
        );
      })}
    </Box>
  );
};

export default Categories;
