import React from 'react';
import {useSelector} from 'react-redux';
import {Navigate, Route, Routes, useNavigate} from 'react-router-dom';

import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import {BottomNavigation, BottomNavigationAction, Paper} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';

import {useBudgetOverviews} from '../hooks/useBudgetOverviews';
import {useCategories} from '../hooks/useCategories';

import {AppRoute} from '../../../common/types';
import {RootState} from '../../../store/store';
import {applicationRoutes} from '../AppRoutes';

interface Props {
    onMoreButtonClicked: () => void;
}

const AppContent = ({onMoreButtonClicked}: Props) => {
    const {
        nordigen: {isSetup},
    } = useSelector((state: RootState) => state.connections);
    const navigate = useNavigate();
    useCategories();
    useBudgetOverviews();

    const getSelectedBottomNav = () => {
        // eslint-disable-next-line no-restricted-globals
        return location.pathname;
    };

    const handleBottomNavigationActionClick = (path: string) => {
        navigate(path);
    };

    return (
        <>
            <Routes>
                {applicationRoutes.map(
                    ({path, id, component: RouteComponent, childRoutes}) => {
                        return childRoutes === undefined ? (
                            <Route key={id} path={path} element={<RouteComponent/>}></Route>
                        ) : (
                            <Route key={id} path={path} element={<RouteComponent/>}>
                                {childRoutes &&
                                    childRoutes?.map(
                                        ({id, path, component: ChildComponent}: AppRoute) => (
                                            <Route
                                                key={id}
                                                path={path}
                                                element={<ChildComponent/>}
                                            ></Route>
                                        ),
                                    )}
                            </Route>
                        );
                    },
                )}
                <Route path="*" element={<Navigate to="/"/>}/>
            </Routes>
            <Toolbar/>
            <Toolbar/>
            <Paper
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    zIndex: 2,
                    paddingBottom: '10px',
                }}
                elevation={3}
            >
                {isSetup === true && (
                    <BottomNavigation showLabels value={getSelectedBottomNav()}>
                        {applicationRoutes
                            .filter((route) => route.showInBottomNav)
                            .map(({path, id, name, menuIcon: MenuIcon}) => {
                                return (
                                    <BottomNavigationAction
                                        key={id}
                                        value={path}
                                        label={name}
                                        icon={<MenuIcon/>}
                                        onClick={() => handleBottomNavigationActionClick(path)}
                                    />
                                );
                            })}

                        <BottomNavigationAction
                            label="More"
                            icon={<MenuOpenIcon/>}
                            onClick={onMoreButtonClicked}
                        />
                    </BottomNavigation>
                )}
            </Paper>
        </>
    );
};

export default AppContent;
