import React, {useEffect, useState} from 'react';

import {Collections} from '@expense-manager/schema';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
    Checkbox,
    Divider,
    FormControl,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    OutlinedInput,
} from '@mui/material';

import {LabelWithId} from '../../../common/types/labels';

interface Props {
    selectedLabels: Collections.Transactions.TransactionLabel[];
    onAddLabel: (label: string) => void;
    labels: Collections.Labels.LabelWithId[];
    onLabelSelected: (label: Collections.Labels.LabelWithId) => void;
}

const Labels = ({
                    onAddLabel,
                    selectedLabels,
                    labels,
                    onLabelSelected,
                }: Props) => {
    const [newLabel, setNewLabel] = useState<string>('');
    const [filteredLabels, setFilteredLabels] =
        useState<Collections.Labels.LabelWithId[]>(labels);

    const handleLabelTextChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const value = event.target.value.toLowerCase();
        setNewLabel(value);
        setFilteredLabels(
            labels.filter((label) => label.name.toLowerCase().indexOf(value) > -1),
        );
    };

    const isLabelExist = () =>
        labels.find((label) => label.name.toLowerCase() === newLabel) !== undefined;

    useEffect(() => {
        setFilteredLabels(
            labels.filter((label) => label.name.toLowerCase().indexOf(newLabel) > -1),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [labels]);

    const handleAddLabel = () => {
        if (isLabelExist()) {
            return;
        }

        onAddLabel(newLabel);
    };

    const handleLabelSelection = (label: Collections.Labels.LabelWithId) => {
        onLabelSelected(label);
    };

    return (
        <>
            <FormControl variant="outlined" fullWidth>
                <InputLabel htmlFor="add-new-label">Search label</InputLabel>
                <OutlinedInput
                    id="add-new-label"
                    type="text"
                    value={newLabel}
                    onChange={handleLabelTextChange}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="add new label"
                                onClick={handleAddLabel}
                                edge="end"
                                disabled={isLabelExist()}
                            >
                                <AddCircleIcon/>
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Add label"
                />
            </FormControl>
            <Divider sx={{marginTop: '10px'}}/>
            <List subheader={<ListSubheader>Available labels</ListSubheader>}>
                {filteredLabels.map((label: LabelWithId) => {
                    return (
                        <ListItem
                            key={label.name}
                            divider
                            secondaryAction={
                                <Checkbox
                                    edge="end"
                                    onChange={() => handleLabelSelection(label)}
                                    checked={
                                        selectedLabels.find(
                                            (selectedLabel) => selectedLabel.id === label.id,
                                        ) !== undefined
                                    }
                                    inputProps={{'aria-labelledby': label.id}}
                                />
                            }
                        >
                            <ListItemText inset primary={label.name}/>
                        </ListItem>
                    );
                })}
            </List>
            {filteredLabels.length === 0 && (
                <List>
                    <ListItem disablePadding divider>
                        <ListItemText primary="No labels"/>
                    </ListItem>
                </List>
            )}
        </>
    );
};

export default Labels;
