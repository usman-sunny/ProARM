import type { EChartsOption } from 'echarts';

export function buildEChartsOptions(report: any): EChartsOption {
    const type = report.reportType;
    const xAxisData = report.chartData?.xAxis || [];
    const yAxisData = report.chartData?.series || [];

    if (type === 'pie') {
            const pieData = xAxisData.map((name: string, i: number) => ({
                name,
                value: yAxisData[i] ?? 0,
        }));

        return {
            tooltip: { trigger: 'item' },
            series: [
                {
                    type: 'pie',
                    radius: '60%',
                    data: pieData,
                },
            ],
        };
    }

    // line, bar, etc
    return {
            tooltip: {},
            xAxis: {
            type: 'category',
            data: xAxisData,
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                name: report.name,
                type,
                data: yAxisData,
            },
        ],
    };
}
