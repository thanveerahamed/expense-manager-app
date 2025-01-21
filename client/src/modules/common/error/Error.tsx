import Lottie from 'lottie-react';

import Typography from '@mui/material/Typography';

import error from '../../../assets/lottie/error.json';

const Error = () => {
    return (
        <>
            <Lottie
                animationData={error}
                style={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '200px',
                }}
            />
            <Typography
                variant="h5"
                sx={{
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    width: '80%',
                    textAlign: 'center',
                }}
            >
                Some error occurred. Please try again later
            </Typography>
        </>
    );
};

export default Error;
