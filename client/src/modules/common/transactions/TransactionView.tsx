import React, {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';

import CategoriesScreen from './Categories';
import EditNameModal from './EditNameModal';
import EditNoteModal from './EditNote';
import Labels from './Labels';
import SplitAmountModal from './SplitAmountModal';
import {Collections, Services} from '@expense-manager/schema';
import AddIcon from '@mui/icons-material/Add';
import CallSplitIcon from '@mui/icons-material/CallSplit';
import EditIcon from '@mui/icons-material/Edit';
import {
    Box,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack,
} from '@mui/material';
import Typography from '@mui/material/Typography';

import {useTransaction} from './hooks/useTransaction';
import {useTransactionUpdate} from './hooks/useTransactionUpdate';

import {formatDate} from '../../../common/helpers';
import {formatAmountWithCurrency} from '../../../common/money';
import {unAssignLabel} from '../../../providers';
import BuildingBlocks from '../Loader/BuildingBlocks';
import {CategoriesAvatar} from '../categories';
import Error from '../error/Error';

const TransactionView = () => {
    const {transactionId} = useParams();
    const navigate = useNavigate();

    const {refreshLoadedTransactions} = useTransactionUpdate();

    const {loading, error, transaction, setTransaction} =
        useTransaction(transactionId);

    const [showLabelsDialog, setShowLabelsDialog] = useState<boolean>(false);
    const [showCategoriesDialog, setShowCategoriesDialog] =
        useState<boolean>(false);
    const [showEditNameModal, setShowEditNameModal] = useState<boolean>(false);
    const [showEditNoteModal, setShowEditNoteModal] = useState<boolean>(false);
    const [showSplitAmountModal, setShowSplitAmountModal] =
        useState<boolean>(false);

    const handleLabelsDialogClose = (
        updatedTransaction?: Services.Transactions.Transaction,
    ) => {
        if (updatedTransaction !== undefined) {
            setTransaction(updatedTransaction);
            refreshLoadedTransactions();
        }

        setShowLabelsDialog(false);
    };

    const handleDeleteChip = async (
        label: Collections.Transactions.TransactionLabel,
    ) => {
        if (transaction === undefined) {
            return;
        }

        const updatedTransaction = await unAssignLabel({
            transactionId: transaction.id,
            label,
        });

        setTransaction(updatedTransaction);
    };

    const handleCategoriesDialogClose = (
        updatedTransaction?: Services.Transactions.Transaction,
    ) => {
        if (updatedTransaction !== undefined) {
            setTransaction(updatedTransaction);
            refreshLoadedTransactions();
        }

        setShowCategoriesDialog(false);
    };

    const handleEditNameDialogClose = (
        updatedTransaction?: Services.Transactions.Transaction,
    ) => {
        if (updatedTransaction !== undefined) {
            setTransaction(updatedTransaction);
            refreshLoadedTransactions();
        }

        setShowEditNameModal(false);
    };

    const handleEditNoteDialogClose = (
        updatedTransaction?: Services.Transactions.Transaction,
    ) => {
        if (updatedTransaction !== undefined) {
            setTransaction(updatedTransaction);
            refreshLoadedTransactions();
        }

        setShowEditNoteModal(false);
    };

    const handleSplitAmountDialogClose = () => {
        refreshLoadedTransactions();
        navigate(-1);

        setShowSplitAmountModal(false);
    };

    return (
        <>
            {loading ? (
                <BuildingBlocks/>
            ) : error ? (
                <Error/>
            ) : (
                transaction !== undefined && (
                    <List>
                        <ListItem disablePadding divider>
                            <ListItemButton>
                                <ListItemText
                                    primary={
                                        <Stack direction="row" justifyContent="space-between">
                                            <Typography variant="h5">
                                                {formatAmountWithCurrency(
                                                    transaction.currency,
                                                    transaction.amount,
                                                )}
                                            </Typography>
                                            <Box>
                                                {transaction?.type ===
                                                    Collections.Transactions.TransactionType.Debit && (
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="edit"
                                                            color="secondary"
                                                            onClick={() => setShowSplitAmountModal(true)}
                                                        >
                                                            <CallSplitIcon/>
                                                        </IconButton>
                                                    )}
                                            </Box>
                                        </Stack>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            disablePadding
                            divider
                            secondaryAction={
                                <IconButton
                                    edge="end"
                                    aria-label="edit"
                                    onClick={() => setShowEditNameModal(true)}
                                >
                                    <EditIcon/>
                                </IconButton>
                            }
                        >
                            <ListItemButton>
                                <ListItemText
                                    primary={formatDate(transaction.bookingDate, 'DD MMM YYYY')}
                                    secondary={
                                        <>
                                            <Typography variant="caption" sx={{fontSize: '20px'}}>
                                                {transaction.name}
                                            </Typography>
                                        </>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            disablePadding
                            divider
                            secondaryAction={
                                <IconButton edge="end" aria-label="edit">
                                    <EditIcon/>
                                </IconButton>
                            }
                            onClick={() => setShowCategoriesDialog(true)}
                        >
                            <ListItemButton>
                                <ListItemAvatar>
                                    <CategoriesAvatar
                                        name={transaction.category.parentName}
                                        type={transaction.type}
                                    />
                                </ListItemAvatar>
                                <ListItemText primary={transaction.category.name}/>
                            </ListItemButton>
                        </ListItem>
                        <ListItem
                            sx={{flexWrap: 'wrap', minHeight: '70px'}}
                            divider
                            secondaryAction={
                                <IconButton edge="end" aria-label="edit">
                                    <AddIcon/>
                                </IconButton>
                            }
                            onClick={() => setShowLabelsDialog(true)}
                        >
                            {transaction.labels === undefined ||
                            transaction.labels.length === 0 ? (
                                <Typography variant="caption">Add labels</Typography>
                            ) : (
                                transaction.labels.map((label) => (
                                    <Chip
                                        key={label.id}
                                        sx={{margin: '5px 0'}}
                                        label={label.name}
                                        variant="outlined"
                                        onDelete={() => handleDeleteChip(label)}
                                    />
                                ))
                            )}
                        </ListItem>
                        <ListItem
                            disablePadding
                            divider
                            secondaryAction={
                                <IconButton edge="end" aria-label="edit">
                                    <EditIcon/>
                                </IconButton>
                            }
                            onClick={() => setShowEditNoteModal(true)}
                        >
                            <ListItemButton>
                                <ListItemText
                                    primary="Notes"
                                    secondary={transaction.notes ?? '-'}
                                />
                            </ListItemButton>
                        </ListItem>
                        {transaction.unStructuredDetails && (
                            <ListItem divider>
                                <ListItemText
                                    primary={
                                        <>
                      <span
                          dangerouslySetInnerHTML={{
                              __html: transaction.unStructuredDetails,
                          }}
                      ></span>
                                        </>
                                    }
                                />
                            </ListItem>
                        )}
                    </List>
                )
            )}

            {transaction && showLabelsDialog && (
                <Labels
                    selectedLabels={transaction.labels}
                    open={showLabelsDialog}
                    closeDialog={handleLabelsDialogClose}
                    transactionId={transaction.id}
                />
            )}
            {transaction !== undefined && showCategoriesDialog && (
                <CategoriesScreen
                    transactionId={transaction.id}
                    type={transaction.type}
                    onClose={handleCategoriesDialogClose}
                    categoryId={transaction.category.id}
                />
            )}

            {transaction !== undefined && (
                <EditNameModal
                    open={showEditNameModal}
                    transactionName={transaction.name}
                    onClose={handleEditNameDialogClose}
                    transactionId={transaction.id}
                />
            )}

            {transaction !== undefined && (
                <EditNoteModal
                    open={showEditNoteModal}
                    transactionNote={transaction.notes}
                    onClose={handleEditNoteDialogClose}
                    transactionId={transaction.id}
                />
            )}

            {transaction !== undefined && (
                <SplitAmountModal
                    open={showSplitAmountModal}
                    transactionAmount={transaction.amount}
                    onClose={handleSplitAmountDialogClose}
                    transactionId={transaction.id}
                />
            )}
        </>
    );
};

export default TransactionView;
