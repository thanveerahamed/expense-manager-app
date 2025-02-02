import { SxProps } from '@mui/material';

export const cardContentStyle: SxProps = {
  padding: '0',
};

export const labelsCarContentStyle: SxProps = {
  ...cardContentStyle,
  maxHeight: '210px',
  overflow: 'scroll',
};
