import React, {useState} from 'react';

import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import TodayIcon from '@mui/icons-material/Today';
import {Box, Chip, IconButton, Menu, MenuItem, Stack} from '@mui/material';

import {useTimelineFilterContext} from '../../../context/TimelineFilterContext';

import {LabelsView} from '../../../common/types';

const TimelineFilter = () => {
    const {
        movePrevious,
        displayText,
        selectedView,
        moveNext,
        selectedViewChange,
        gotToToday,
    } = useTimelineFilterContext();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (value: string | null) => {
        setAnchorEl(null);
    };

    const handleSelectedViewChange = (view: LabelsView) => {
        setAnchorEl(null);
        selectedViewChange(view);
    };

    return (
        <Box>
            <Stack direction="row" justifyContent="space-between">
                <IconButton color="success" onClick={handleClick}>
                    <RemoveRedEyeIcon fontSize="inherit"/>
                </IconButton>
                <Box>
                    <IconButton color="success" onClick={movePrevious}>
                        <KeyboardDoubleArrowLeftIcon fontSize="inherit"/>
                    </IconButton>
                    <Chip label={displayText} sx={{width: '200px'}}/>
                    <IconButton color="success" onClick={moveNext}>
                        <KeyboardDoubleArrowRightIcon fontSize="inherit"/>
                    </IconButton>
                </Box>
                <IconButton color="success" onClick={gotToToday}>
                    <TodayIcon fontSize="inherit"/>
                </IconButton>
                <Menu
                    id="view-menu"
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={() => handleClose(null)}
                >
                    {Object.values(LabelsView).map((view) => (
                        <MenuItem
                            key={view}
                            value={view}
                            selected={selectedView === view}
                            onClick={() => handleSelectedViewChange(view)}
                        >
                            {view}
                        </MenuItem>
                    ))}
                </Menu>
            </Stack>
        </Box>
    );
};

export default TimelineFilter;
