import {useCallback} from 'react';

import {ApexOptions} from 'apexcharts';

import {ChartType} from '../types';

const defaultChartColors = ['#66bb6a'];

const chartLegend: ApexLegend = {
    position: 'bottom',
};

export interface Props {
    chartType: ChartType;
    labels: string[];
    series: ApexOptions['series'];
    dataLabelFormatter?: (
        val: string | number | number[],
        opts?: any,
    ) => string | number;
    chartColors?: string[];
}

export const useChart = ({
                             chartType,
                             series,
                             labels,
                             dataLabelFormatter,
                             chartColors,
                         }: Props) => {
    const getChartData = useCallback(() => {
        const options: ApexCharts.ApexOptions = {
            chart: {
                type: chartType,
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            grid: {
                show: false,
            },
            theme: {
                mode: 'dark',
                palette: 'palette1',
                monochrome: {
                    enabled: false,
                    color: '#255aee',
                    shadeTo: 'light',
                    shadeIntensity: 0.65,
                },
            },
            yaxis: {
                labels: {
                    formatter: (val: number) => val.toFixed(0),
                },
            },
            xaxis: {
                labels: {
                    show: labels.length <= 10,
                    rotateAlways: false,
                    hideOverlappingLabels: true,
                },
            },
            labels,
            legend: chartLegend,
            colors: chartColors ?? defaultChartColors,
            ...(dataLabelFormatter !== undefined
                ? {
                    dataLabels: {
                        formatter: dataLabelFormatter,
                    },
                }
                : {}),
        };

        return {
            series,
            options,
        };
    }, [chartType, labels, chartColors, dataLabelFormatter, series]);

    return {
        ...getChartData(),
    };
};
