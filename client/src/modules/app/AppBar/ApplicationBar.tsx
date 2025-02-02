import React from 'react';

import LogoutIcon from '@mui/icons-material/Logout';
import { IconButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import { logout } from '../../../common/firebase/firebase';
import { UserDemographics } from '../../../common/types/user';

interface Props {
  user?: UserDemographics;
  onMenuClick: () => void;
}

const ApplicationBar = ({ user, onMenuClick }: Props) => {
  const handleLogOut = async () => {
    await logout();
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/*{user !== null && user !== undefined && (*/}
        {/*  <IconButton*/}
        {/*    size="large"*/}
        {/*    edge="start"*/}
        {/*    color="inherit"*/}
        {/*    aria-label="menu"*/}
        {/*    sx={{ mr: 2 }}*/}
        {/*    onClick={onMenuClick}*/}
        {/*  >*/}
        {/*    <MenuIcon />*/}
        {/*  </IconButton>*/}
        {/*)}*/}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Expense Manager
        </Typography>
        {user !== null && user !== undefined && (
          <IconButton
            size="large"
            aria-haspopup="true"
            onClick={handleLogOut}
            color="inherit"
          >
            <LogoutIcon />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ApplicationBar;
