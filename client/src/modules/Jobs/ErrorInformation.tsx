import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography,} from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    error: string;
}

const ErrorInformation = ({open, onClose, error}: Props) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Error information</DialogTitle>
            <DialogContent>
                <Typography variant="caption">{error}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ErrorInformation;
