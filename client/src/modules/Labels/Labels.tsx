import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useNavigate } from 'react-router-dom';

import LabelsSkeleton from './Skeletons/LabelsSkeleton';
import {
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

import {
  TimelineFilterProvider,
  useTimelineFilterContext,
} from '../../context/TimelineFilterContext';

import { useAuthorization } from '../app/hooks/useAuthorization';
import { useLabelsOverviews } from './hooks/useLabelsOverviews';
import { usePieChart } from './hooks/usePieChart';

import { formatAmountWithCurrency } from '../../common/money';
import Error from '../common/error/Error';
import TimelineFilter from '../common/filters/TimelineFilter';

const Labels = () => {
  const { duration, isLoading: monthsLoading } = useTimelineFilterContext();
  const navigate = useNavigate();

  const { labelsOverviews, error } = useLabelsOverviews({
    duration,
  });

  const { options, series } = usePieChart(labelsOverviews);

  const handleLabelClick = (id: string) => {
    navigate(
      `/labels/${id}/transactions?startDate=${duration.startDate.format(
        'YYYY-MM-DD',
      )}&endDate=${duration.endDate.format('YYYY-MM-DD')}`,
    );
  };

  if (monthsLoading) {
    return <LabelsSkeleton />;
  }

  if (error) {
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
        <Typography variant="h5">Labels</Typography>
      </Box>
      <TimelineFilter />

      {labelsOverviews.length > 0 ? (
        <>
          <ReactApexChart options={options} series={series} type="donut" />
          <List>
            {labelsOverviews.map((label) => {
              return (
                <ListItem
                  disablePadding
                  divider
                  key={label.label.id}
                  onClick={() => handleLabelClick(label.label.id)}
                >
                  <ListItemText
                    primary={
                      <Typography variant="caption">
                        {label.label.name}
                      </Typography>
                    }
                  />
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.secondary"
                  >
                    {formatAmountWithCurrency(
                      label.amount.currency,
                      label.amount.amount.toString(),
                    )}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        </>
      ) : (
        <Alert severity="warning">No data to display.</Alert>
      )}
    </>
  );
};

const LabelsWrapper = () => {
  const { demographics } = useAuthorization();

  return (
    <TimelineFilterProvider user={demographics}>
      <Labels />
    </TimelineFilterProvider>
  );
};

export default LabelsWrapper;
