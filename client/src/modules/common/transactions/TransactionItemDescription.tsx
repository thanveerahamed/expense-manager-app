import React from 'react';

import NoteAltIcon from '@mui/icons-material/NoteAlt';
import {Box, ListItemText, Stack} from '@mui/material';

interface Props {
    name: string;
    category: string;
    parentCategory: string;
    notes?: string;
}

const getCategoryName = (category: string, parentCategory: string) =>
    category.toLowerCase().indexOf('other') > -1
        ? `${parentCategory} - ${category}`
        : category;

const truncateNotes = (notes: string) =>
    notes.length > 20 ? `${notes.substring(0, 17)}...` : notes;

const TransactionItemDescription = ({
                                        name,
                                        category,
                                        parentCategory,
                                        notes,
                                    }: Props) => {
    return (
        <ListItemText
            primary={name}
            secondary={
                <>
                    {getCategoryName(category, parentCategory)}
                    <br/>
                    {notes && (
                        <Stack direction="row" spacing={1}>
                            <NoteAltIcon fontSize="small" color="success"/>{' '}
                            <Box>{truncateNotes(notes)}</Box>
                        </Stack>
                    )}
                </>
            }
        />
    );
};

export default TransactionItemDescription;
