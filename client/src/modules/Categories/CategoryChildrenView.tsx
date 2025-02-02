import React from 'react';

import { BaseCategory } from './types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

interface Props {
  categories: BaseCategory[];
  selectedCategoryId?: string;
  onCategorySelected?: (category: BaseCategory) => void;
}

const CategoryChildrenView = ({
  categories,
  selectedCategoryId,
  onCategorySelected,
}: Props) => {
  const showTick = (category: BaseCategory) => {
    const result =
      selectedCategoryId !== undefined && category.id === selectedCategoryId;
    return result;
  };

  const handleOnClick = (category: BaseCategory) => {
    if (onCategorySelected !== undefined) onCategorySelected(category);
  };

  return (
    <List>
      {categories.map((category) => {
        return (
          <React.Fragment key={category.name}>
            <ListItem
              sx={{ pl: 8 }}
              selected={showTick(category)}
              secondaryAction={
                showTick(category) ? (
                  <IconButton edge="end" aria-label="edit">
                    <CheckCircleIcon color="success" />
                  </IconButton>
                ) : null
              }
              onClick={() => handleOnClick(category)}
            >
              <ListItemText primary={category.name} />
            </ListItem>
          </React.Fragment>
        );
      })}
      <Divider variant="inset" component="li" />
    </List>
  );
};

export default CategoryChildrenView;
