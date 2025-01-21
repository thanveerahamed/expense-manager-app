import React, {useState} from 'react';

import {Collections} from '@expense-manager/schema';
import {Avatar, Box, Fab, List, ListItemAvatar, ListItemButton, ListItemText, Typography, Zoom,} from '@mui/material';
import {useTheme} from '@mui/material/styles';

import {useInstitutions} from '../hooks/useInstitutions';
import {useRequisition} from '../hooks/useRequisition';

import BuildingBlocks from '../../common/Loader/BuildingBlocks';
import Error from '../../common/error/Error';

const fabStyle = {
    position: 'fixed',
    bottom: 65,
    right: 16,
};

const BankSelector = () => {
    const theme = useTheme();
    const transitionDuration = {
        enter: theme.transitions.duration.enteringScreen,
        exit: theme.transitions.duration.leavingScreen,
    };

    const [selectedBank, setSelectedBank] = useState<
        Collections.BankingApi.Institution | undefined
    >(undefined);

    const {
        institutions,
        isLoading: loadingInstitutions,
        error: institutionsError,
    } = useInstitutions();

    const {createRequisition, isLoading: createRequisitionLoading} =
        useRequisition({institution: selectedBank});

    const handleSelectBank = (
        institution: Collections.BankingApi.Institution | undefined,
    ) => {
        setSelectedBank(institution);
    };

    const handleAuthenticationClicked = async () => {
        await createRequisition();
    };

    if (institutionsError) {
        return <Error/>;
    }

    return (
        <Box sx={{position: 'relative'}}>
            <Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid gray',
                    }}
                >
                    <Typography variant="h5">Select bank</Typography>
                </Box>
                {loadingInstitutions ? (
                    <BuildingBlocks/>
                ) : (
                    <List>
                        {institutions.map(
                            (institution: Collections.BankingApi.Institution) => (
                                <ListItemButton
                                    selected={selectedBank?.id === institution.id}
                                    onClick={() => handleSelectBank(institution)}
                                    key={institution.id}
                                >
                                    <ListItemAvatar sx={{borderRadius: '100'}}>
                                        <Avatar alt={institution.name} src={institution.logo}/>
                                    </ListItemAvatar>
                                    <ListItemText primary={institution.name}/>
                                </ListItemButton>
                            ),
                        )}
                    </List>
                )}
            </Box>
            <Zoom
                in={selectedBank !== undefined}
                timeout={transitionDuration}
                style={{
                    transitionDelay: `${
                        selectedBank !== undefined ? transitionDuration.exit : 0
                    }ms`,
                }}
                unmountOnExit
            >
                <Fab
                    disabled={createRequisitionLoading}
                    sx={fabStyle}
                    color="success"
                    variant="extended"
                    onClick={handleAuthenticationClicked}
                >
                    {createRequisitionLoading ? 'Working...' : 'Authentication'}
                </Fab>
            </Zoom>
        </Box>
    );
};

export default BankSelector;
