import React, {useState} from 'react';
import {toast} from 'react-toastify';

import {Services} from '@expense-manager/schema';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {Backdrop, Box, Button, CircularProgress, Dialog, IconButton, TextareaAutosize,} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import {updateNote} from '../../../providers';
import TransitionLeft from '../transitions/TransitionLeft';

interface Props {
    open: boolean;
    transactionNote?: string;
    onClose: (transaction?: Services.Transactions.Transaction) => void;
    transactionId: string;
}

const EditNoteModal = ({
                           open,
                           transactionNote,
                           onClose,
                           transactionId,
                       }: Props) => {
    const [note, setNote] = useState<string | undefined>(transactionNote ?? '');
    const [loading, setLoading] = useState<boolean>(false);

    const handleSave = () => {
        (async () => {
            setLoading(true);
            try {
                const transaction = await updateNote({
                    transactionId,
                    note: note ?? '',
                });
                onClose(transaction);
            } catch (error: any) {
                toast('Error occurred.');
            }
            setLoading(false);
        })();
    };

    return (
        <>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1}}
                open={loading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Dialog
                open={open}
                fullScreen
                onClose={() => onClose()}
                TransitionComponent={TransitionLeft}
            >
                <AppBar sx={{position: 'sticky'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={() => onClose()}
                            aria-label="close"
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                            Category
                        </Typography>
                        <Button
                            color="success"
                            onClick={handleSave}
                            disabled={note === transactionNote}
                        >
                            Save
                        </Button>
                    </Toolbar>
                </AppBar>
                <Box sx={{margin: '10px 5px'}}>
                    <TextareaAutosize
                        aria-label="notes textarea"
                        placeholder="Notes"
                        minRows={10}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        style={{width: '100%'}}
                    />
                </Box>
            </Dialog>
        </>
    );
};

export default EditNoteModal;
