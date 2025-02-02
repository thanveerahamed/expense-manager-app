import './buildingBlocks.css';
import { Box } from '@mui/material';

const BuildingBlocks = () => {
  return (
    <Box sx={{ paddingLeft: '50%', paddingRight: '50%', paddingTop: '350px' }}>
      <div className="building-blocks">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </Box>
  );
};

export default BuildingBlocks;
