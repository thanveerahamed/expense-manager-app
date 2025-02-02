import React from 'react';

import { Avatar } from '@mui/material';

import { getAvatarStyle } from '../../../common/categories';

interface Props {
  type: string;
  name: string;
}

export const CategoriesAvatar = ({ name, type }: Props) => {
  return (
    <Avatar
      sx={getAvatarStyle(name, type.toLowerCase())}
      imgProps={{
        sx: {
          width: '60%',
          height: '60%',
        },
      }}
      src={`/assets/category/${type.toLowerCase()}/${name}.png`}
    ></Avatar>
  );
};

export default CategoriesAvatar;
