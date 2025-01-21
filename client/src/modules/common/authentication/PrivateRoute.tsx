import React from 'react';
import {Navigate} from 'react-router-dom';

import Toolbar from '@mui/material/Toolbar';

import {useAuthorization} from '../../app/hooks/useAuthorization';

import BuildingBlocks from '../Loader/BuildingBlocks';
import BottomNavBar from '../navigation/BottomNavBar';

interface Props {
    children: JSX.Element | JSX.Element[];
    onMoreButtonClicked: () => void;
}

const PrivateRoute = ({children, onMoreButtonClicked}: Props) => {
    const {error, loading, demographics} = useAuthorization();

    if (loading) {
        return <BuildingBlocks/>;
    }

    if (demographics === undefined || error) {
        return <Navigate to="/login" replace/>;
    }

    return (
        <>
            {children}
            <Toolbar/>
            <BottomNavBar onMoreButtonClicked={onMoreButtonClicked}/>
        </>
    );
};

export default PrivateRoute;
