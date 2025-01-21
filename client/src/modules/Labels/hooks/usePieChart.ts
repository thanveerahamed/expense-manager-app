import {useCallback} from 'react';

import {LabelWithAmount} from '../../../common/types/labels';

const colors = [
    '#ff6961',
    '#ffb480',
    '#f8f38d',
    '#42d6a4',
    '#08cad1',
    '#59adf6',
    '#9d94ff',
    '#c780e8',
];

const legend: ApexLegend = {
    position: 'bottom',
};

const dataLabelsFormatter = (val: number, opts?: any): number => {
    return opts.w.config.series[opts.seriesIndex];
};

export const usePieChart = (labelsOverviews: LabelWithAmount[]) => {
    const getChartData = useCallback(() => {
        if (labelsOverviews.length > 6) {
            const topSixPicks = labelsOverviews.slice(0, 6);
            const restOfThePicks = labelsOverviews.slice(6, labelsOverviews.length);
            const totalOthers = Number(
                restOfThePicks
                    .reduce((sum, value) => {
                        return value.amount.amount + sum;
                    }, 0)
                    .toFixed(2),
            );

            const series = [
                ...topSixPicks.map((pick) => pick.amount.amount),
                totalOthers,
            ];

            const labels = [...topSixPicks.map((pick) => pick.label.name), 'others'];

            const options: ApexCharts.ApexOptions = {
                chart: {
                    type: 'donut',
                },
                labels,
                legend,
                colors,
                dataLabels: {
                    formatter: dataLabelsFormatter,
                },
            };

            return {
                series,
                options,
            };
        } else {
            const labels = labelsOverviews.map(
                (labelsOverview) => labelsOverview.label.name,
            );
            const options: ApexCharts.ApexOptions = {
                chart: {
                    type: 'donut',
                },
                labels,
                legend,
                colors,
                dataLabels: {
                    formatter: dataLabelsFormatter,
                },
            };
            return {
                series: labelsOverviews.map(
                    (labelsOverview) => labelsOverview.amount.amount,
                ),
                options,
            };
        }
    }, [labelsOverviews]);

    return {
        ...getChartData(),
    };
};
