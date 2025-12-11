import { Component, OnInit, OnDestroy, ElementRef, ViewChild, HostListener } from '@angular/core';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, Subscription } from 'rxjs';
import { CdkDragDrop, CdkDragMove, CdkDragEnd } from '@angular/cdk/drag-drop';
import type { ECharts, EChartsOption, SeriesOption } from 'echarts';
import { buildEChartsOptions } from '../build-echarts-options';

export interface ReportDefinition {
    id: string;
    name: string;
}
export interface ReportInstance extends ReportDefinition {
    x: number;
    y: number;
    width: number;
    height: number;
}
@Component({
    selector: 'scrm-analytics-create-dashboard',
    templateUrl: './analytics-create-dashboard.component.html'
})
export class AnalyticsCreateDashboardComponent implements OnInit, OnDestroy {

    collectionId: string = '';
    dashboardId: string = '';
    protected subs: Subscription[] = [];
    dashboardName: string = '';
    reports$!: Observable<any[]>;

    defaultWidth: number = 715;
    defaultHeight: number = 360;

    @ViewChild('canvas', { static: true })
    canvasRef!: ElementRef<HTMLDivElement>;

    canvasReports: ReportInstance[] = [];
    chartInstances = new Map<string, ECharts>();
    
    private resizing = {
        horizontal: false,
        vertical: false,
        report: null as ReportInstance | null,
        startX: 0,
        startY: 0,
        startWidth: 0,
        startHeight: 0
    };

    constructor(
        private stupidService: StupidDataService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.collectionId = this.route.parent?.snapshot.paramMap.get('collectionId');
        this.dashboardId = this.route.snapshot.paramMap.get('dashboardId');

        if (this.collectionId) {
            this.reports$ = this.stupidService
                .nltGetAllReports({ collectionId: this.collectionId })
                .pipe(
                    map((data: any[]) =>
                        data.map(r => ({
                            ...r,
                            options: buildEChartsOptions(r),
                        }))
                    )
                );
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    dropOnCanvas(event: CdkDragDrop<ReportDefinition[]>) {
        if (event.previousContainer === event.container) {
            return;
        }

        const def = event.item.data as ReportDefinition;
        const canvasRect = this.canvasRef.nativeElement.getBoundingClientRect();

        // place roughly where the pointer was
        const pointer = event.dropPoint;
        let x = pointer.x - canvasRect.left;
        let y = pointer.y - canvasRect.top;

        // Check for overlaps and adjust position
        while (this.hasOverlap(x, y, this.defaultWidth, this.defaultHeight)) {
            //x += 20;
            y += 20;
        }

        const instance: ReportInstance = {
            ...def,
            x,
            y,
            width: this.defaultWidth,
            height: this.defaultHeight,
        };

        this.canvasReports = [...this.canvasReports, instance];

        console.log('after drop on canvas canvasReports', this.canvasReports);
    }

    private hasOverlap(
        x: number,
        y: number,
        width: number,
        height: number,
        ignoreId?: string,
    ): boolean {
        return this.canvasReports.some(report => {
            if (ignoreId && report.id === ignoreId) {
                return false;
            }

            return !(
                x + width <= report.x ||
                x >= report.x + report.width ||
                y + height <= report.y ||
                y >= report.y + report.height
            );
        });
    }

    saveDashboard(): void {
        console.log('saveDashboard');
        console.log('canvasReports', this.canvasReports);
        console.log('dashboardName', this.dashboardName);


        const layoutData = this.canvasReports.map(report => ({
            reportId: report.id,
            x: report.x,
            y: report.y,
            width: report.width,
            height: report.height,
        }));

        const data = {
            collectionId: this.collectionId,
            dashboardId: this.dashboardId,
            dashboardName: this.dashboardName,
            layoutData: layoutData,
        };

        console.log('data in saveDashboard after refining: ', data);

        this.stupidService.nltSaveDashboard(data).subscribe((response: any) => {
            console.log('response in saveDashboard', response);
        });
    }

    onReportDragEnd(event: CdkDragEnd, report: ReportInstance): void {
        const { x, y } = event.distance;

        let nextX = report.x + x;
        let nextY = report.y + y;

        // Avoid overlapping existing reports when repositioning
        while (this.hasOverlap(nextX, nextY, report.width, report.height, report.id)) {
            //nextX += 20;
            nextY += 20;
        }

        report.x = nextX;
        report.y = nextY;
    
        // Reset the transform so the element is only positioned via left/top
        event.source.reset();
    
        // Trigger change detection
        this.canvasReports = [...this.canvasReports];

        console.log('after drag end canvasReports', this.canvasReports);
    }

    onChartInit(chart: ECharts, report: ReportInstance) {
        this.chartInstances.set(report.id, chart);
    }
    
    startHorizontalResize(event: MouseEvent, report: ReportInstance) {
        event.stopPropagation();
        this.resizing.horizontal = true;
        this.resizing.report = report;
    
        this.resizing.startX = event.clientX;
        this.resizing.startWidth = report.width;
    }
    
    startVerticalResize(event: MouseEvent, report: ReportInstance) {
        event.stopPropagation();
        this.resizing.vertical = true;
        this.resizing.report = report;
    
        this.resizing.startY = event.clientY;
        this.resizing.startHeight = report.height;
    }
    
    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        const r = this.resizing;
    
        if (!r.report) return;
    
        if (r.horizontal) {
          const dx = event.clientX - r.startX;
          r.report.width = Math.max(100, r.startWidth + dx);
        }
    
        if (r.vertical) {
          const dy = event.clientY - r.startY;
          r.report.height = Math.max(80, r.startHeight + dy);
        }

        const chart = this.chartInstances.get(r.report.id);
        if (chart) {
            chart.resize();
        }
    }
    
    @HostListener('document:mouseup')
    stopResize() {
        this.resizing.horizontal = false;
        this.resizing.vertical = false;
        this.resizing.report = null;
    }

}
