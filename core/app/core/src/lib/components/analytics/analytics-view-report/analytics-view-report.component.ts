import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';
import type { ECharts, EChartsOption, SeriesOption  } from 'echarts';
import { Router } from '@angular/router';

@Component({
    selector: 'scrm-view-report',
    templateUrl: './analytics-view-report.component.html'
})
export class ViewReportComponent implements OnInit {
    collectionId: string = '';
    reportId: string = '';
    private chart!: ECharts;
    xAxisData: any[] = [];
    yAxisData: any[] = [];
    chartType: string = '';
    reportName: string = '';

    chartOptions: EChartsOption = {
        tooltip: {},
        xAxis: {},
        yAxis: {},
        series: [
            {
                name: 'Data',
                type: '' as any,
            }
        ],
    };

    constructor(
        private stupidService: StupidDataService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.collectionId = this.route.parent?.snapshot.paramMap.get('collectionId');
        this.reportId = this.route.snapshot.paramMap.get('reportId');
        console.log("showing child  id: ", this.reportId);
        this.stupidService.nltViewReport({ id: this.reportId }).subscribe(value => {
            if (value) {
                this.xAxisData = value?.chartData?.xAxis || [];
                this.yAxisData = value?.chartData?.series || [];
                this.chartType = value?.reportType || 'bar';
                this.reportName = value?.reportName || '';

                // This displayChart() is called when the chart is saved
                if (this.chart) {
                    this.displayChart();
                }
            }
        });
    }

    displayChart() {
        let nextOptions: EChartsOption;

        if (this.chartType === 'pie') { 
            const pieData = (this.xAxisData || []).map((name: string, i: number) => ({
                name,
                value: (this.yAxisData || [])[i] ?? 0,
            }));
            
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
					data: this.xAxisData
				},
				yAxis: {},
				series: [
					{
						name: 'Data',
						type: this.chartType as any,
						data: this.yAxisData,
						animationDelay: idx => idx * 10,
					}
				],
				animationEasing: 'elasticOut',
				animationDelayUpdate: idx => idx * 5,
			};
        }

        this.chartOptions = nextOptions;
        this.chart.setOption(nextOptions, true);
    }

    onChartInit(ec: ECharts) {
		this.chart = ec;
        
        // this displayChart() is called when page reloads
        if (this.xAxisData && this.yAxisData && this.xAxisData.length > 0) {
            this.displayChart();
        }
    }

    navToEditView(): void {
        this.router.navigate(['/pd_collections', this.collectionId, 'edit', this.reportId]);
    }

}
