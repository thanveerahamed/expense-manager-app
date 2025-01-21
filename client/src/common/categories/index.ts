import {SxProps} from '@mui/material';

import {singleEntryCategories} from '../../modules/Categories/types';

export const getAvatarStyle = (name: string, type: string): SxProps => {
    if (!singleEntryCategories.includes(name)) {
        return {background: type === 'debit' ? 'green' : '#0e7cf2'};
    }

    return {background: 'inherit'};
};
