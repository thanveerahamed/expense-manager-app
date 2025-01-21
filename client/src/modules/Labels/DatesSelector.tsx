import * as React from 'react';
import {useState} from 'react';

import {DateRange} from '@mui/lab';
import {Box, Button, Chip, Dialog, DialogActions, DialogContent,} from '@mui/material';
import {DateRangeCalendar} from '@mui/x-date-pickers-pro/DateRangeCalendar';
import {PickerSelectionState} from '@mui/x-date-pickers/internals';
import {Dayjs} from 'dayjs';
import styled from 'styled-components';

const StyledDialogContent = styled(DialogContent)`
  padding: 0 !important;
`;

interface Props {
    startDate: Dayjs;
    endDate: Dayjs;
    onDateSelected: (startDate: Dayjs, endDate: Dayjs) => void;
}

const DatesSelector = ({startDate, endDate, onDateSelected}: Props) => {
    const [showModal, setShowModal] = useState<boolean>(false);
    const [selectedStartDate, setSelectedStartDate] =
        React.useState<Dayjs | null>(startDate);
    const [selectedEndDate, setSelectedEndDate] = React.useState<Dayjs | null>(
        endDate,
    );

    const handleClose = () => {
        setShowModal(false);
    };

    const handleSelect = () => {
        setShowModal(false);

        if (selectedStartDate !== null && selectedEndDate != null) {
            onDateSelected(selectedStartDate, selectedEndDate);
        }
    };

    const handleDateChange = (
        [startPosition, endPosition]: DateRange<Dayjs>,
        selectionState: PickerSelectionState | undefined,
    ) => {
        setSelectedStartDate(startPosition);
        setSelectedEndDate(endPosition);
    };

    return (
        <Box>
            <Chip
                label={`${startDate.format('DD-MMM-YYYY')} - ${endDate.format(
                    'DD-MMM-YYYY',
                )}`}
                onClick={() => setShowModal(true)}
            />
            <Dialog
                open={showModal}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <StyledDialogContent>
                    <DateRangeCalendar
                        calendars={1}
                        value={[selectedStartDate, selectedEndDate]}
                        onChange={handleDateChange}
                    />
                </StyledDialogContent>
                <DialogActions>
                    <Button
                        color="success"
                        variant="contained"
                        onClick={handleSelect}
                        disabled={selectedStartDate === null || selectedEndDate === null}
                    >
                        Select
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleClose}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default DatesSelector;
