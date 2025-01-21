import React, {useState} from 'react';
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import {ToastContainer} from 'react-toastify';

import ApplicationBar from './AppBar/ApplicationBar';
import ApplicationDrawer from './AppDrawer/AppDrawer';
import {applicationRoutes} from './AppRoutes';
import {Box} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';

import {useAuthorization} from './hooks/useAuthorization';

import {AppRoute} from '../../common/types';
import Login from '../Login/Login';
import Register from '../Register/Register';
import ScrollToTop from '../common/ScrollToTop/ScrollToTop';
import PrivateRoute from '../common/authentication/PrivateRoute';

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: ['Mooli', 'sans-serif'].join(','),
    },
});

const App = () => {
    const [showApplicationDrawer, setShowApplicationDrawer] =
        useState<boolean>(false);

    const {demographics} = useAuthorization();

    // TODO: Can be used when the nordigen authorization is implemented
    //useNordigen();

    // TODO - Does not work currently
    // useBrowserNotification(demographics);

    return (
        <ThemeProvider theme={darkTheme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <BrowserRouter>
                    <ScrollToTop/>
                    <CssBaseline/>
                    <ApplicationBar
                        user={demographics}
                        onMenuClick={() => setShowApplicationDrawer(true)}
                    />
                    <ApplicationDrawer
                        open={showApplicationDrawer}
                        onCloseDrawer={() => setShowApplicationDrawer(false)}
                    />
                    <ToastContainer position="bottom-center" theme="dark"/>
                    <Box sx={{margin: '10px 10px'}}>
                        <Routes>
                            {applicationRoutes.map(
                                ({path, id, component: RouteComponent, childRoutes}) => {
                                    return childRoutes === undefined ? (
                                        <Route
                                            key={id}
                                            path={path}
                                            element={
                                                <PrivateRoute
                                                    onMoreButtonClicked={() =>
                                                        setShowApplicationDrawer(true)
                                                    }
                                                >
                                                    <RouteComponent/>
                                                </PrivateRoute>
                                            }
                                        ></Route>
                                    ) : (
                                        <Route
                                            key={id}
                                            path={path}
                                            element={
                                                <PrivateRoute
                                                    onMoreButtonClicked={() =>
                                                        setShowApplicationDrawer(true)
                                                    }
                                                >
                                                    <RouteComponent/>
                                                </PrivateRoute>
                                            }
                                        >
                                            {childRoutes &&
                                                childRoutes?.map(
                                                    ({
                                                         id,
                                                         path,
                                                         component: ChildComponent,
                                                     }: AppRoute) => (
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
                            <Route path="/login" element={<Login/>}></Route>
                            <Route path="/register" element={<Register/>}></Route>
                            <Route path="*" element={<Navigate to="/"/>}/>
                        </Routes>
                    </Box>
                </BrowserRouter>
            </LocalizationProvider>
        </ThemeProvider>
    );
};

export default App;
