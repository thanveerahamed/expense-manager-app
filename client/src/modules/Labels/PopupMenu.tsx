import React, { useState } from 'react';

import { Box, Chip, Menu, MenuItem } from '@mui/material';

interface Option {
  label: string;
  value: string;
}

interface Props {
  selectedValue: string;
  onSelect?: (value: string | null) => void;
  options: Option[];
  displayValue?: string;
}

const PopupMenu = ({
  selectedValue,
  onSelect,
  options,
  displayValue,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (value: string | null) => {
    setAnchorEl(null);

    if (onSelect) onSelect(value);
  };

  return (
    <Box>
      <Chip label={displayValue ?? selectedValue} onClick={handleClick} />
      <Menu
        id="view-menu"
        anchorEl={anchorEl}
        open={openMenu}
        onClose={() => handleClose(null)}
      >
        {options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            onClick={() => handleClose(option.value)}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default PopupMenu;
