import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {toast} from 'react-toastify';

import {Collections, Services} from '@expense-manager/schema';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    Dialog,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Autocomplete from '@mui/material/Autocomplete';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import useLabels from '../common/labels/hooks/useLabels';

import {isBudgetValidForCreate} from '../../common/budgets';
import {createBudget, deleteBudget, getBudget, updateBudget,} from '../../providers';
import {RootState} from '../../store/store';
import {OrderedCategory} from '../Categories/types';
import TransitionLeft from '../common/transitions/TransitionLeft';

const budgetOperatorMap: {
    [key in Collections.Budgets.BudgetCombination]: string;
} = {
    [Collections.Budgets.BudgetCombination.CategoriesOnly]: 'Categories Only',
    [Collections.Budgets.BudgetCombination.LabelsOnly]: 'Labels Only',
    [Collections.Budgets.BudgetCombination.CategoriesAndLabels]:
        'Categories AND Labels',
    [Collections.Budgets.BudgetCombination.CategoriesOrLabels]:
        'Categories OR Labels',
};

interface Props {
    onClose: (refresh?: boolean) => void;
    show: boolean;
    budgetId?: string;
}

const EditBudgetView = ({show, onClose, budgetId}: Props) => {
    const {
        category: {categories},
    } = useSelector((state: RootState) => state);
    const {isLoading: isLoadingLabels, labels} = useLabels();

    const [budget, setBudget] = useState<Services.Budgets.Budget>({
        name: '',
        id: '',
        amount: 0,
        labels: [],
        categories: [],
        operator: Collections.Budgets.BudgetCombination.CategoriesOnly,
    });
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleBackClick = () => {
        onClose();
    };

    const handleChange = (key: string, value: string) => {
        if (key === 'operator') {
            setBudget({
                ...budget,
                operator: value as Collections.Budgets.BudgetCombination,
            });
        } else if (key === 'amount') {
            const positiveAmount = Number(value) < 0 ? 0 : Number(value);
            setBudget({
                ...budget,
                amount: positiveAmount,
            });
        } else {
            setBudget({
                ...budget,
                [key]: value,
            });
        }
    };

    const categoryList = categories
        .filter(
            (category) =>
                category.type === Collections.Transactions.TransactionType.Debit,
        )
        .reduce(
            (
                previousValue: Collections.Category.Entity[],
                currentValue: OrderedCategory,
            ): Collections.Category.Entity[] => {
                return [
                    ...previousValue,
                    ...currentValue.children.map(
                        (child): Collections.Category.Entity => ({
                            ...child,
                            parent: currentValue.name,
                            parentPriority: currentValue.priority,
                            id: child.id === undefined ? '' : child.id,
                        }),
                    ),
                ];
            },
            [],
        );

    const handleCategoriesAutoCompleteChange = (
        e: React.SyntheticEvent,
        categories?: Collections.Category.Entity[],
    ) => {
        if (categories === undefined) {
            setBudget({
                ...budget,
                categories: [],
            });
        } else {
            const nonDuplicateCategories = categories.reduce(
                (
                    previousValue: Collections.Category.Entity[],
                    currentValue: Collections.Category.Entity,
                ): Collections.Category.Entity[] => {
                    if (
                        previousValue.find((value) => value.id === currentValue.id) ===
                        undefined
                    ) {
                        return [...previousValue, currentValue];
                    } else {
                        return previousValue;
                    }
                },
                [],
            );

            setBudget({
                ...budget,
                categories: nonDuplicateCategories,
            });
        }
    };

    const handleLabelsAutoCompleteChange = (
        e: React.SyntheticEvent,
        labels?: Omit<Collections.Labels.LabelWithId, 'createdAt'>[],
    ) => {
        if (labels === undefined) {
            setBudget({
                ...budget,
                labels: [],
            });
        } else {
            setBudget({
                ...budget,
                labels: labels,
            });
        }
    };

    const handleSaveBudget = () => {
        if (isBudgetValidForCreate(budget)) {
            (async () => {
                setIsLoading(true);
                try {
                    const response =
                        budget.id === ''
                            ? await createBudget(budget)
                            : await updateBudget(budget);
                    setBudget({
                        ...budget,
                        id: response.id,
                    });

                    toast('Successfully saved', {type: 'success'});

                    setTimeout(() => {
                        onClose(true);
                    }, 2000);
                } catch (e) {
                    toast('Some error occurred. Please try again.', {type: 'error'});
                }
                setIsLoading(false);
            })();
        } else {
            toast('Please complete the fields', {type: 'error'});
        }
    };

    const handleDelete = () => {
        (async () => {
            setIsLoading(true);
            try {
                await deleteBudget(budget.id);
                await setTimeout(() => {
                }, 1000);
                setIsLoading(false);
                onClose(true);
            } catch (e) {
                toast('Some error occurred. Please try again.', {type: 'error'});
                setIsLoading(false);
            }
        })();
    };

    useEffect(() => {
        if (budgetId !== undefined) {
            (async () => {
                setIsLoading(true);
                const response = await getBudget(budgetId);
                setBudget(response.budget);
                setIsLoading(false);
            })();
        }
    }, [budgetId]);

    return (
        <>
            <Backdrop
                sx={{
                    color: '#fff',
                    zIndex: (theme) => theme.zIndex.modal + 1000,
                    position: 'absolute',
                }}
                open={isLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
            <Dialog
                fullScreen
                open={show}
                onClose={handleBackClick}
                TransitionComponent={TransitionLeft}
            >
                <AppBar sx={{position: 'sticky'}}>
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            onClick={handleBackClick}
                            aria-label="close"
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
                            {budgetId === undefined ? 'Add' : 'Edit'} Budget
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Box sx={{margin: '10px 5px'}}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                id="name"
                                label="Name"
                                variant="outlined"
                                value={budget.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                id="amount"
                                label="Amount"
                                variant="outlined"
                                value={budget.amount}
                                fullWidth
                                onChange={(e) => handleChange('amount', e.target.value)}
                                type="number"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="label-operator">Combination</InputLabel>
                                <Select
                                    labelId="label-operator"
                                    id="select-operator"
                                    value={budget.operator}
                                    label="Combination"
                                    onChange={(e) => handleChange('operator', e.target.value)}
                                >
                                    {Object.keys(budgetOperatorMap).map((operator) => (
                                        <MenuItem value={operator} key={operator}>
                                            {
                                                budgetOperatorMap[
                                                    operator as Collections.Budgets.BudgetCombination
                                                    ]
                                            }
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {budget.operator !==
                            Collections.Budgets.BudgetCombination.LabelsOnly && (
                                <Grid item xs={12}>
                                    <Autocomplete
                                        multiple
                                        id="categories-outlined"
                                        options={categoryList.filter(
                                            (item) =>
                                                !budget.categories
                                                    .map((category) => category.id)
                                                    .includes(item.id),
                                        )}
                                        getOptionLabel={(option) => option.name}
                                        groupBy={(option) => option.parent}
                                        filterSelectedOptions
                                        value={budget.categories}
                                        onChange={handleCategoriesAutoCompleteChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Categories"
                                                placeholder="Categories"
                                            />
                                        )}
                                    />
                                </Grid>
                            )}
                        {budget.operator !==
                            Collections.Budgets.BudgetCombination.CategoriesOnly && (
                                <Grid item xs={12}>
                                    <Autocomplete
                                        multiple
                                        id="categories-outlined"
                                        options={labels}
                                        loading={isLoadingLabels}
                                        loadingText="Loading..."
                                        getOptionLabel={(option) => option.name}
                                        filterSelectedOptions
                                        value={budget.labels}
                                        onChange={handleLabelsAutoCompleteChange}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Labels"
                                                placeholder="Labels"
                                            />
                                        )}
                                    />
                                </Grid>
                            )}
                        <Grid item xs={12}>
                            <Button
                                color="success"
                                fullWidth
                                variant="contained"
                                startIcon={<CheckBoxIcon/>}
                                onClick={handleSaveBudget}
                            >
                                SAVE
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            {budget.id !== '' && (
                                <Button
                                    color="error"
                                    fullWidth
                                    variant="contained"
                                    startIcon={<DeleteIcon/>}
                                    onClick={handleDelete}
                                >
                                    DELETE
                                </Button>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Dialog>
        </>
    );
};

export default EditBudgetView;
