import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Input } from '@angular/core';
import type { ECharts, EChartsOption, SeriesOption  } from 'echarts';

@Component({
    selector: 'nlt-chart',
    templateUrl: './analytics-chart.component.html'
})
export class AnalyticsChartComponent implements OnInit {

    @Input() x;
    @Input() y;
    @Input() chartType;
    //chart: ECharts;

    chartOptions: EChartsOption;

    constructor(
    ) { }

    ngOnInit(): void {
        console.log("AnalyticsChartComponent ngOnInit");
        console.log("x:", this.x);
        console.log("y:", this.y);
        console.log("chartType:", this.chartType);

        let nextOptions: EChartsOption;

        if (this.chartType === 'pie') { 
            const pieData = (this.x || []).map((name: string, i: number) => ({
                name,
                value: (this.y || [])[i] ?? 0,
            }));

            console.log("pie data:", pieData);
            
            nextOptions = {
                tooltip: { trigger: 'item' },
                xAxis: undefined,
                yAxis: undefined,
                series: [
                    {
                        type: 'pie',
                        radius: '60%',
                        data: pieData,
                    } as SeriesOption,
                ],
            };
        } else {
            nextOptions = {
				tooltip: {},
				xAxis: {
					data: this.x
				},
				yAxis: {},
				series: [
					{
						name: 'Data',
						type: this.chartType as any,
						data: this.y,
						animationDelay: idx => idx * 10,
					}
				],
				animationEasing: 'elasticOut',
				animationDelayUpdate: idx => idx * 5,
			};
        }

        this.chartOptions = { ...nextOptions };

        //this.chart.setOption(nextOptions, true);

        console.log("xAxis:", this.x);   
        console.log("yAxis:", this.y);   
        console.log("chartType:", this.chartType);   
        //console.log("nextOptions:", nextOptions);   

        //Update the chart instance directly if available
		// if (this.chart) {
		// 	this.chart.setOption(nextOptions, true);
		// } else {
		// 	console.log("Chart instance not available yet");
		// }

    }

    // displayChart(): void {
        

    // }

    // onChartInit(ec: ECharts) {
    //     console.log("Chart initialized:", ec);
    //     this.chart = ec;

    //     this.displayChart();
    // }

}
