import React from 'react';

import {Box, List, ListItem, ListItemButton, ListItemText, Skeleton, Typography,} from '@mui/material';

const LabelsSkeleton = () => {
    return (
        <>
            <Typography variant="caption">
                <Skeleton sx={{width: '150px'}} animation="wave"/>
            </Typography>
            <Box sx={{display: 'flex', justifyContent: 'center'}}>
                <Skeleton variant="circular" width={150} height={150}/>
            </Box>
            <List>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(
                    (index) => {
                        return (
                            <ListItem key={index} disablePadding divider>
                                <ListItemButton>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1">
                                                <Skeleton sx={{width: '100px'}} animation="wave"/>
                                            </Typography>
                                        }
                                    />
                                    <Typography variant="caption">
                                        <Skeleton sx={{width: '100px'}} animation="wave"/>
                                    </Typography>
                                </ListItemButton>
                            </ListItem>
                        );
                    },
                )}
            </List>
        </>
    );
};

export default LabelsSkeleton;
