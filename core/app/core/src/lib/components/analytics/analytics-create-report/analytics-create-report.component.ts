import { Component, OnInit, OnDestroy } from '@angular/core';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';
import { Subscription } from 'rxjs';
import type { ECharts, EChartsOption, SeriesOption } from 'echarts';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

export interface FilterModel {
    fieldLabel: string;
    fieldName: string;
    fieldType: string;
    criteria: any[];
}

@Component({
  	selector: 'nlt-create-report',
  	templateUrl: './analytics-create-report.component.html',
})
export class AnalyticsCreateReportComponent implements OnInit, OnDestroy {

	fields$ = this.stupidService.nltModuleFields$;
	protected subs: Subscription[] = [];
	private chart!: ECharts;

	reportId: string = '';
	collectionId: string = '';

	moduleName: string = '';
	columns: any[] = [];
	moduleFields: any[] = [];
	
	reportName: string = '';
	tab: string = 'graph';
	chartType: string = 'bar';

	xAxis = '';
	xAxisFieldName = '';
	xAxisFieldType = '';
	xAxisAggregate = 'actual';
	xAxisSave = '';
	xAxisAggregateSave = '';

	yAxis = '';
	yAxisFieldName = '' ;
	yAxisFieldType = '';
	yAxisAggregate = 'actual';
	yAxisSave = '';
	yAxisAggregateSave = '';

	color = '';
	text = '';
	size = '';
	tooltip: any[] = [];
	tooltipFieldName: any[] = [];

	xAxisData: any[] | null = null;
	yAxisData: any[] | null = null;
	
	wildcardValues: any[] = [{ dvalue: 'Exactly Matches', ivalue: '', condition: 'OR' }];

	filters: any[] = [];
	currentFilterView: FilterModel;
	
	isRangeModalVisible: boolean = false;
	rmDropdownValue: string = 'Above';
	rmDateDropdownValue: string = 'From';
	rmInputOne: string = '';
	rmInputTwo: string = '';
	rmDateInputOne: string = '';
	rmDateInputTwo: string = '';

	constructor(
        private stupidService: StupidDataService,
        private router: Router,
		private route: ActivatedRoute,
    ) {
    }


  	ngOnInit(): void {
		this.reportId = this.route.snapshot.paramMap.get('reportId');
		this.collectionId = this.route.parent?.snapshot.paramMap.get('collectionId');

		if (this.reportId) {
			this.subs.push(this.stupidService.nltGetReportData(this.reportId).pipe(delay(500)).subscribe(value => {
				if (value) {
					this.moduleName = value.moduleName;
					this.xAxisData = value.chartData.xAxis;
					this.yAxisData = value.chartData.series;
					this.moduleFields = value.moduleFields;
					this.chartType = value.reportType;
					this.reportName = value.reportName;
					this.xAxis = value.xAxis;
					this.yAxis = value.yAxis;
					this.xAxisFieldName = value.xAxisField;
					this.xAxisAggregate = value.xAxisAggregate;
					this.xAxisFieldType = value.xAxisFieldType;
					this.yAxisFieldName = value.yAxisField;
					this.yAxisAggregate = value.yAxisAggregate;
					this.yAxisFieldType = value.yAxisFieldType;
					this.xAxisSave = this.xAxisFieldName;
					this.xAxisAggregateSave = this.xAxisAggregate;
					this.yAxisSave = this.yAxisFieldName;
					this.yAxisAggregateSave = this.yAxisAggregate;

					if (value.filters) {
						this.filters = value.filters;
						this.currentFilterView = this.filters[0];
					}

					this.stupidService.setNltModuleFields(this.moduleFields);
					this.displayChart();
				}
			}));
		} else {
			this.subs.push(this.stupidService.nltNewReport$.subscribe(value => {
				if (value) {
					this.moduleName = value.moduleName;
				}
			}));
	
			if (this.moduleName) {
				this.subs.push(this.stupidService.getNltModuleFields(this.moduleName).subscribe());
			}
		}
  	}


	ngOnDestroy(): void {
		this.subs.forEach(sub => sub.unsubscribe());
	}


	changeTab(tab: string) {
		this.tab = tab;
	}


	createChart(): void {
		if (this.xAxisFieldName && this.yAxisFieldName) {
			
			const data = {
				"moduleName": this.moduleName,
				"x-axis": this.xAxisFieldName,
				"x-axis-aggregate": this.xAxisAggregate,
				"y-axis": this.yAxisFieldName,
				"y-axis-aggregate": this.yAxisAggregate,
				"graphType": this.chartType,
				"filters": this.filters,
			}

			this.stupidService.getNltCreateReport(data).subscribe(value => {
				if (value) {
					console.log("chart data received:", value);
					this.xAxisData = value.xAxis;
					this.yAxisData = value.series;

					this.displayChart();

					this.xAxisSave = this.xAxisFieldName;
					this.xAxisAggregateSave = this.xAxisAggregate;
					this.yAxisSave = this.yAxisFieldName;
					this.yAxisAggregateSave = this.yAxisAggregate;
				}
			});

		} else {
			console.log("Missing required fields");
		}
	}


	onChartInit(ec: ECharts) {
		this.chart = ec;
	}


	displayChart(): void {
		let nextOptions: EChartsOption;

		if (this.chartType === 'pie' ) {

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
					}
				],
			}
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

		if (this.chart) {
			this.chart.setOption(nextOptions, true);
		} else {
			console.log("Chart instance not available yet");
		}
	}

	
	changeChartType(type: 'bar' | 'line' | 'scatter' | 'pie') {
		if (!this.chart) return;

		this.chartType = type;
		this.displayChart();
	}


	removeItem(item: 'xAxis' | 'yAxis' | 'color' | 'text' | 'size') {
		this[item] = '';
		this[item + 'FieldName'] = '';
		this[item + 'FieldType'] = '';
		this[item + 'Aggregate'] = 'actual';
		this[item + 'AggregateSave'] = '';
	}


	saveReport(): void {
		if (this.reportName && this.xAxisSave && this.yAxisSave) {
			
			const data = {
				"id": this.reportId,
				"collectionId": this.collectionId,
				"moduleName": this.moduleName,
				"reportName": this.reportName,
				"x-axis": this.xAxisSave,
				"x-axis-aggregate": this.xAxisAggregateSave,
				"y-axis": this.yAxisSave,
				"y-axis-aggregate": this.yAxisAggregateSave,
				"graphType": this.chartType,
				"filters": this.filters,
			}

			this.stupidService.nltSaveReport(data).subscribe(value => {
				if (value.success) {
					alert("Report saved successfully");
					this.router.navigate(['/pd_collections', this.collectionId, 'view', value.data_id]);
				}
			});
		} else {
			console.log("Report not saved - Missing Required fields");
		}
	}


	showFilter(filter: FilterModel): void {
		console.log("showing filter:", filter);
		this.currentFilterView = filter;
	}


	addValue(): void {
		this.currentFilterView.criteria.push({ dvalue: 'Exactly Matches', ivalue: '', condition: 'OR' });
		console.log("currentFilterView.criteria after addition:", this.currentFilterView.criteria);
		console.log("Filters:", this.filters);
	}


	removeValue(i: number) {
		this.currentFilterView.criteria.splice(i, 1);
		console.log("currentFilterView.criteria after removal:", this.currentFilterView.criteria);
		console.log("Filters:", this.filters);
	}


	toggleCondition(i: number) {
		this.currentFilterView.criteria[i].condition = this.currentFilterView.criteria[i].condition === 'OR' ? 'AND' : 'OR';
		console.log("currentFilterView.criteria after condition toggle:", this.currentFilterView.criteria);
		console.log("Filters:", this.filters);
	}


	removeFilter($event: MouseEvent, filter: FilterModel) {
		$event.stopPropagation();
		this.filters = this.filters.filter(f => f !== filter);
		console.log("Filters after removal:", this.filters);
	}


	generateWildcardQuery(): void {

		// (
		// 	@for (w of wildcardValues; track $index; let i = $index; let last = $last; let j = 0) {
		// 		{{i+1}}
				
		// 		@if (!last) {
		// 			{{w.condition}}
		// 		}

		// 		@if (w.condition != wildcardValues[i+1].condition && i+2 < wildcardValues.length && !last) {
		// 			(
		// 			{{j}}
		// 		}

		// 		@if (last) {
		// 			@for (i = 0; i < j; i++) {
		// 				)
		// 			}
		// 		}
		// 	}
		// )
		
	}

	openRangeModal(): void {
		this.isRangeModalVisible = true;
	}


	closeRangeModal(): void {
		this.isRangeModalVisible = false;
		this.rmDropdownValue = 'Above';
		this.rmInputOne = '';
		this.rmInputTwo = '';
		this.rmDateDropdownValue = 'From';
		this.rmDateInputOne = '';
		this.rmDateInputTwo = '';
	}


	addFilterRange(): void {
		if (this.currentFilterView.fieldType == 'number') {
			this.isRangeModalVisible = false;
			this.currentFilterView.criteria.push({ condition: this.rmDropdownValue, rangeFrom: this.rmInputOne, rangeTo: this.rmInputTwo });
			this.rmDropdownValue = 'Above';
			this.rmInputOne = '';
			this.rmInputTwo = '';
		}
		if (this.currentFilterView.fieldType == 'date') {
			this.isRangeModalVisible = false;
			this.currentFilterView.criteria.push({ condition: this.rmDateDropdownValue, rangeFrom: this.rmDateInputOne, rangeTo: this.rmDateInputTwo });
			this.rmDateDropdownValue = 'From';
			this.rmDateInputOne = '';
			this.rmDateInputTwo = '';
		}
	}


	removeFilterRange(i: number): void {
		this.currentFilterView.criteria.splice(i, 1);
		console.log("Filters:", this.filters);
	}


	// *********** Drag and Drop Functions ***********
	onDragEnter(ev: DragEvent) {
	    (ev.currentTarget as HTMLElement).classList.add('drag-over');
	}


	onDragLeave(ev: DragEvent) {
	    (ev.currentTarget as HTMLElement).classList.remove('drag-over');
	}

	
	// When starting the drag on the column item:
	onDragStart(ev: DragEvent, fieldLabel: string, fieldName: string, fieldType: string) {
		const payload = { fieldLabel, fieldName, fieldType };

		ev.dataTransfer?.setData('payload', JSON.stringify(payload));
	    //ev.dataTransfer?.setData('text/plain', fieldLabel);
		if (ev.dataTransfer) {
			ev.dataTransfer.effectAllowed = 'copy';
			ev.dataTransfer.dropEffect = 'copy';
		}
	}


	// Allow drop over inputs
	onDragOver(event: DragEvent) {
		event.preventDefault();
	}


	onDropToSlot(ev: DragEvent, field: 'xAxis' | 'yAxis' | 'color' | 'text' | 'size', fieldName: string) {
		ev.preventDefault();
		this.removeItem(field);

		const payload = ev.dataTransfer?.getData('payload');
		if (payload) {
			const payloadObj = JSON.parse(payload);
			this[field] = payloadObj.fieldLabel;
			this[fieldName] = payloadObj.fieldName;
			this[field + 'FieldType'] = payloadObj.fieldType;
		}
	
		// const text = ev.dataTransfer?.getData('text/plain')?.trim();
		// if (!text) return;
	
		// this[field] = text;
	}


	onDropToSlotMulti(ev: DragEvent, field: string, fieldName: string) {
		ev.preventDefault();

		const payload = ev.dataTransfer?.getData('payload');
		if (payload) {
			const payloadObj = JSON.parse(payload);
			this[field] = [...this[field], payloadObj.fieldLabel];
			this[fieldName] = [...this[fieldName], payloadObj.fieldName];
		}
	}


	onDropToFilter(ev: DragEvent) {
		ev.preventDefault();

		const payload = ev.dataTransfer?.getData('payload');
		if (payload) {
			const payloadObj = JSON.parse(payload);

			const filter: FilterModel = {
				fieldLabel: payloadObj.fieldLabel,
				fieldName: payloadObj.fieldName,
				fieldType: payloadObj.fieldType,
				criteria: [],
			};

			if (payloadObj.fieldType === 'text') {
				filter.criteria.push({ dvalue: 'Exactly Matches', ivalue: '', condition: 'OR' });
			}

			this.filters.push(filter);

			this.currentFilterView = filter;

			console.log("filters after drop to filter:", this.filters);
		}
	}

	// Attach the column name to the drag payload
	// onDragStart(event: DragEvent, fieldLabel: string) {
	//   event.dataTransfer?.setData('text/plain', fieldLabel);
	//   // (optional) tweak drag effect
	//   if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy';
	// }
  
	// Handle drop -> put value into the right bound property
	// onDropToInput(event: DragEvent, field: keyof CreateReportComponent) {
	//   event.preventDefault();
	//   const text = event.dataTransfer?.getData('text/plain')?.trim();
	//   if (!text) return;
  
	//   // If you want to REPLACE the value:
	//   (this as any)[field] = text;
  
	//   // If you want to APPEND (comma-separated), use this instead:
	//   // const current = (this as any)[field] as string;
	//   // (this as any)[field] = current ? `${current}, ${text}` : text;
	// }

}
