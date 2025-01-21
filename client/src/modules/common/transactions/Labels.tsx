import React, {useState} from 'react';
import {toast} from 'react-toastify';

import {Collections, Services} from '@expense-manager/schema';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Box, Button, Dialog, IconButton} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import useLabels from '../labels/hooks/useLabels';

import {assignLabels} from '../../../providers';
import BuildingBlocks from '../Loader/BuildingBlocks';
import Error from '../error/Error';
import LabelsView from '../labels/Labels';
import TransitionLeft from '../transitions/TransitionLeft';

interface Props {
    open: boolean;
    closeDialog: (updatedTransaction?: Services.Transactions.Transaction) => void;
    selectedLabels?: Collections.Transactions.TransactionLabel[];
    transactionId: string;
}

const Labels = ({
                    open,
                    closeDialog,
                    selectedLabels: previouslySelectedLabels,
                    transactionId,
                }: Props) => {
    const {labels, isLoading, error, addNewLabel} = useLabels();

    const [selectedLabels, setSelectedLabels] = useState<
        Collections.Transactions.TransactionLabel[]
    >(previouslySelectedLabels ?? []);

    const handleAddLabel = (newLabel: string) => {
        if (
            newLabel === '' ||
            labels.find((label) => label.name === newLabel) !== undefined
        ) {
            return;
        }

        addNewLabel(newLabel);
    };

    const handleLabelSelection = ({
                                      id,
                                      name,
                                  }: Collections.Labels.LabelWithId) => {
        if (
            selectedLabels.find((selectedLabel) => selectedLabel.id === id) ===
            undefined
        ) {
            setSelectedLabels([...selectedLabels, {id, name}]);
            return;
        }

        setSelectedLabels(
            selectedLabels.filter((selectedLabel) => selectedLabel.id !== id),
        );
    };

    const handleBackClick = () => {
        setSelectedLabels([]);
        closeDialog();
    };

    const handleAssignLabel = async () => {
        try {
            const updatedTransaction = await assignLabels({
                transactionId,
                labels: selectedLabels,
            });
            closeDialog(updatedTransaction);
        } catch (error: any) {
            console.log(error);
            toast('Unable to add the label. Try again later');
        }
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={handleBackClick}
            TransitionComponent={TransitionLeft}
        >
            {open && (
                <>
                    <AppBar sx={{position: 'fixed'}}>
                        <Toolbar>
                            <IconButton
                                edge="start"
                                color="inherit"
                                onClick={handleBackClick}
                                aria-label="close"
                            >
                                <ArrowBackIcon/>
                            </IconButton>
                            <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                                Labels
                            </Typography>
                            <Button color="success" onClick={handleAssignLabel}>
                                Assign
                            </Button>
                        </Toolbar>
                    </AppBar>
                    <Toolbar/>
                    <Box sx={{margin: '15px 5px'}}>
                        {isLoading ? (
                            <BuildingBlocks/>
                        ) : error ? (
                            <Error/>
                        ) : (
                            <LabelsView
                                labels={labels}
                                selectedLabels={selectedLabels ?? []}
                                onAddLabel={handleAddLabel}
                                onLabelSelected={handleLabelSelection}
                            />
                        )}
                    </Box>
                </>
            )}
        </Dialog>
    );
};

export default Labels;
