import React from 'react';

import {Box, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Typography,} from '@mui/material';

const Loading = () => {
    return (
        <Box>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    borderBottom: '1px solid gray',
                }}
            >
                <Typography variant="h5" sx={{width: '200px', marginBottom: '10px'}}>
                    <Skeleton variant="rectangular" animation="wave"></Skeleton>
                </Typography>
                <Box>
                    <Skeleton
                        variant="rectangular"
                        sx={{width: '50px'}}
                        animation="wave"
                    ></Skeleton>
                </Box>
            </Box>

            <List>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19].map(
                    (index) => {
                        return (
                            <ListItem key={index} disablePadding divider>
                                <ListItemButton>
                                    <ListItemAvatar>
                                        <Skeleton
                                            animation="wave"
                                            variant="circular"
                                            width={40}
                                            height={40}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1">
                                                <Skeleton sx={{width: '150px'}} animation="wave"/>
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="caption">
                                                <Skeleton sx={{width: '150px'}} animation="wave"/>
                                            </Typography>
                                        }
                                    />
                                </ListItemButton>
                                <span style={{marginRight: '5px', textAlign: 'right'}}>
                  <Typography variant="h6">
                    <Skeleton sx={{width: '50px'}} animation="wave"/>
                  </Typography>
                  <Typography variant="body2">
                    <Skeleton sx={{width: '50px'}} animation="wave"/>
                  </Typography>
                </span>
                            </ListItem>
                        );
                    },
                )}
            </List>
        </Box>
    );
};

export default Loading;
