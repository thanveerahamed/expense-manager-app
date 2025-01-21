import React from 'react';

import {
    Card,
    CardContent,
    CardHeader,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Skeleton,
    Typography,
} from '@mui/material';

const LoadingSkeleton = () => {
    return (
        <Card sx={{minWidth: '250px'}}>
            <CardHeader
                title={
                    <Typography variant="h4">
                        <Skeleton sx={{width: '200px'}} animation="wave"/>
                    </Typography>
                }
                action={
                    <Typography variant="h4">
                        <Skeleton sx={{width: '50px'}} animation="wave"/>
                    </Typography>
                }
            />
            <CardContent sx={{padding: '10px'}}>
                <List>
                    {['1', '2', '3'].map((index) => {
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
                    })}
                </List>
            </CardContent>
        </Card>
    );
};

export default LoadingSkeleton;
