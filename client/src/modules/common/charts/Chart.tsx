import React from 'react';
import ReactApexChart from 'react-apexcharts';

import { ChartType } from './types';
import { ApexOptions } from 'apexcharts';

import { useChart } from './hooks/useChart';

interface Props {
  chartType: ChartType;
  labels: string[];
  series: ApexOptions['series'];
  dataLabelFormatter?: (
    val: string | number | number[],
    opts?: any,
  ) => string | number;
  chartColors?: string[];
}

const Chart = (props: Props) => {
  const { options, series } = useChart(props);
  return (
    <ReactApexChart options={options} series={series} type={props.chartType} />
  );
};

export default Chart;
