import React, { useState } from 'react';
import { toast } from 'react-toastify';

import ErrorInformation from './ErrorInformation';
import { Collections, Services } from '@expense-manager/schema';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import SyncIcon from '@mui/icons-material/Sync';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import { useSyncTransactionJobs } from './hooks/useSyncTransactionJobs';

import { formatDate } from '../../common/helpers';
import { createSyncTransactionsJob } from '../../providers';
import Error from '../common/error/Error';

const SyncTransactionJobs = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { isLoading, jobs, reloadJobs, error } = useSyncTransactionJobs();
  const [selectedJob, setSetSelectedJob] = useState<
    Services.SyncTransactionsJobs.Entity | undefined
  >(undefined);

  const reload = () => {
    (async () => {
      await reloadJobs();
    })();
  };

  const handleAddClick = () => {
    (async () => {
      try {
        await createSyncTransactionsJob();
        toast(
          'A new job was created successfully. The jobs will be refreshed.',
          {
            type: 'success',
            closeButton: false,
            onOpen: () => {
              setLoading(true);
            },
            onClose: () => {
              setLoading(false);
              reload();
            },
          },
        );
      } catch (e: any) {
        setLoading(false);
        toast('Some error occurred. Please try again later', {
          type: 'error',
        });
      }
    })();
  };

  if (error !== undefined) {
    return <Error />;
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid gray',
        }}
      >
        <Typography variant="h5">Sync Transaction Jobs</Typography>
        <Box>
          <IconButton disabled={isLoading || loading} onClick={handleAddClick}>
            <AddIcon />
          </IconButton>
          <IconButton disabled={isLoading || loading} onClick={reload}>
            <RefreshIcon
              sx={
                isLoading || loading
                  ? {
                      'animation': 'spin 2s linear infinite',
                      '@keyframes spin': {
                        '0%': {
                          transform: 'rotate(-360deg)',
                        },
                        '100%': {
                          transform: 'rotate(0deg)',
                        },
                      },
                    }
                  : {}
              }
            />
          </IconButton>
        </Box>
      </Box>
      <List>
        {jobs.map((job) => {
          return (
            <ListItem
              key={job.id}
              divider
              secondaryAction={
                job.status ===
                Collections.SyncTransactionsJobs.SyncTransactionsJobStatus
                  .FAILED ? (
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => setSetSelectedJob(job)}
                  >
                    <InfoIcon color="error" />
                  </IconButton>
                ) : null
              }
            >
              <ListItemIcon>
                {job.status ===
                Collections.SyncTransactionsJobs.SyncTransactionsJobStatus
                  .COMPLETED ? (
                  <CheckCircleIcon color="success" />
                ) : job.status ===
                  Collections.SyncTransactionsJobs.SyncTransactionsJobStatus
                    .FAILED ? (
                  <CancelIcon color="error" />
                ) : (
                  <SyncIcon color="secondary" />
                )}
              </ListItemIcon>
              <ListItemText
                secondary={formatDate(
                  job.createdAt.toLocaleString(),
                  'DD MMM YYYY hh:mm:ss A',
                )}
                primary={job.status}
              />
            </ListItem>
          );
        })}
      </List>
      <ErrorInformation
        open={selectedJob !== undefined}
        onClose={() => setSetSelectedJob(undefined)}
        error={
          selectedJob?.error === undefined
            ? 'No information available'
            : selectedJob.error
        }
      />
    </>
  );
};

export default SyncTransactionJobs;
