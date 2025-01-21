import React from 'react';
import {useNavigate} from 'react-router-dom';

import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    ListSubheader,
    SxProps,
} from '@mui/material';

import {AppRoute, NavGroup} from '../../../common/types';
import {applicationRoutes} from '../AppRoutes';

const subheaderStyle: SxProps = {
    background: 'inherit',
    borderBottom: '1px #757575 solid',
};

interface ApplicationMenu {
    parent: NavGroup;
    routes: AppRoute[];
}

interface Props {
    open: boolean;
    onCloseDrawer: () => void;
}

const ApplicationDrawer = ({onCloseDrawer, open}: Props) => {
    const navigate = useNavigate();
    const handleLinkClick = () => {
        onCloseDrawer();
    };

    const getGroupedMenuItems = () => {
        return applicationRoutes.reduce(
            (accumulator: ApplicationMenu[], route): ApplicationMenu[] => {
                if (route.parent === undefined || route.showInSideMenu !== true) {
                    return accumulator;
                }

                const existingParent = accumulator.find(
                    (acc) => acc.parent === route.parent,
                );

                if (existingParent !== undefined) {
                    existingParent.routes.push(route);

                    return [
                        ...accumulator.filter(
                            (acc) => acc.parent !== existingParent.parent,
                        ),
                        existingParent,
                    ];
                }

                return [
                    ...accumulator,
                    {
                        parent: route.parent,
                        routes: [route],
                    },
                ];
            },
            [],
        );
    };

    const handleNavigation = (path: string) => {
        navigate(path);
    };

    return (
        <React.Fragment>
            <Drawer open={open} onClose={onCloseDrawer} anchor="right">
                <Box
                    sx={{width: 250}}
                    role="presentation"
                    onClick={handleLinkClick}
                    onKeyDown={handleLinkClick}
                >
                    {getGroupedMenuItems().map((menuItem) => {
                        return (
                            <List
                                key={menuItem.parent}
                                subheader={
                                    <ListSubheader
                                        component="div"
                                        id="daily-expense-subheader"
                                        sx={subheaderStyle}
                                    >
                                        {menuItem.parent}
                                    </ListSubheader>
                                }
                            >
                                {menuItem.routes.map(
                                    ({id, name, path, menuIcon: MenuIcon}) => {
                                        return (
                                            <ListItem key={id} disablePadding>
                                                <ListItemButton onClick={() => handleNavigation(path)}>
                                                    <ListItemIcon>
                                                        <MenuIcon/>
                                                    </ListItemIcon>
                                                    <ListItemText primary={name}/>
                                                </ListItemButton>
                                            </ListItem>
                                        );
                                    },
                                )}
                            </List>
                        );
                    })}
                </Box>
            </Drawer>
        </React.Fragment>
    );
};

export default ApplicationDrawer;
