import React from 'react';
import { useNavigate } from 'react-router-dom';

import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';

import { DeviceOS, getMobileOperatingSystem } from '../../../common/helpers';
import { applicationRoutes } from '../../app/AppRoutes';

interface Props {
  onMoreButtonClicked: () => void;
}

const BottomNavBar = ({ onMoreButtonClicked }: Props) => {
  const getSelectedBottomNav = () => {
    // eslint-disable-next-line no-restricted-globals
    return location.pathname;
  };

  const navigate = useNavigate();
  const handleBottomNavigationActionClick = (path: string) => {
    navigate(path);
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        paddingBottom:
          getMobileOperatingSystem() === DeviceOS.IOs ? '10px' : '0px',
      }}
      elevation={3}
    >
      <BottomNavigation showLabels value={getSelectedBottomNav()}>
        {applicationRoutes
          .filter((route) => route.showInBottomNav)
          .map(({ path, id, name, menuIcon: MenuIcon }) => {
            return (
              <BottomNavigationAction
                key={id}
                value={path}
                label={name}
                icon={<MenuIcon />}
                onClick={() => handleBottomNavigationActionClick(path)}
              />
            );
          })}

        <BottomNavigationAction
          label="More"
          icon={<MenuOpenIcon />}
          onClick={onMoreButtonClicked}
        />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNavBar;
