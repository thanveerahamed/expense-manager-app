import React, {forwardRef} from 'react';

import Slide from '@mui/material/Slide';
import {TransitionProps} from '@mui/material/transitions';

const TransitionLeft = forwardRef(
    (
        props: TransitionProps & {
            children: React.ReactElement;
        },
        ref: React.Ref<unknown>,
    ) => {
        return <Slide direction="left" ref={ref} {...props} />;
    },
);

export default TransitionLeft;
