import React, { forwardRef } from 'react';

import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const TransitionUp = forwardRef(
  (
    props: TransitionProps & {
      children: React.ReactElement;
    },
    ref: React.Ref<unknown>,
  ) => {
    return <Slide direction="up" ref={ref} {...props} />;
  },
);

export default TransitionUp;
