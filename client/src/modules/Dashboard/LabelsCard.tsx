import React from 'react';
import { useNavigate } from 'react-router-dom';

import LoadingSkeleton from './LoadingSkeleton';
import { labelsCarContentStyle } from './styles';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Typography,
} from '@mui/material';
import Toolbar from '@mui/material/Toolbar';

import { formatAmountWithCurrency } from '../../common/money';
import { LabelWithAmount } from '../../common/types/labels';

interface Props {
  labelsOverviews: LabelWithAmount[];
  loading: boolean;
  error: Error | undefined;
}

const LabelsCard = ({ labelsOverviews, loading, error }: Props) => {
  const navigate = useNavigate();

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <Box>
      <Card sx={{ minWidth: '250px' }}>
        <CardHeader
          title="Labels"
          titleTypographyProps={{
            style: {
              fontSize: '1.2rem',
            },
          }}
          action={
            error === undefined ? (
              <Button onClick={() => navigate('/labels')}>View more</Button>
            ) : null
          }
        />
        <CardContent sx={labelsCarContentStyle}>
          {error !== undefined && (
            <Alert severity="error">
              Unable to obtain the information at this moment
            </Alert>
          )}

          {!loading && error === undefined && labelsOverviews.length === 0 && (
            <Typography sx={{ margin: '20px' }} variant="body1">
              No labels created.
            </Typography>
          )}

          <Box sx={{ margin: '5px' }}>
            {labelsOverviews.map((labelOverview) => {
              return (
                <Chip
                  key={labelOverview.label.id}
                  sx={{ margin: '3px' }}
                  label={
                    <>
                      <p>
                        {labelOverview.label.name} (
                        {formatAmountWithCurrency(
                          labelOverview.amount.currency,
                          labelOverview.amount.amount.toFixed(2),
                        )}
                        )
                      </p>
                    </>
                  }
                  color="success"
                  variant="outlined"
                />
              );
            })}
          </Box>
        </CardContent>
      </Card>
      <Toolbar />
    </Box>
  );
};

export default LabelsCard;
