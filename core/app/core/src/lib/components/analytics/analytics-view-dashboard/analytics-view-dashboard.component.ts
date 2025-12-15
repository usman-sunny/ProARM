import { Component, OnInit } from '@angular/core';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { buildEChartsOptions } from '../build-echarts-options';

@Component({
    selector: 'scrm-analytics-view-dashboard',
    templateUrl: './analytics-view-dashboard.component.html'
})
export class AnalyticsViewDashboardComponent implements OnInit {

    dashboardId: string = '';
    dashboardName: string = '';
    dashboardData$!: Observable<any[]>;
    collectionId: string = '';
    isDeleteModalVisible: boolean = false;

    constructor(
        private stupidService: StupidDataService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.collectionId = this.route.parent?.snapshot.paramMap.get('collectionId');
        this.dashboardId = this.route.snapshot.params['dashboardId'];

        this.dashboardData$ = this.stupidService
            .nltGetDashboardData(this.dashboardId)
            .pipe(
                tap(data => {
                    this.dashboardName = data.dashboardName;
                }),
                map((data: any) => {
                    const layoutData = data.layoutData;

                    return layoutData.map(r => ({
                        ...r,
                        options: buildEChartsOptions(r),
                    }));
                })
            );
    }

    navToEditView(): void {
        this.router.navigate(['/pd_collections', this.collectionId, 'editdashboard', this.dashboardId]);
    }

    openDeleteModal(): void {
        this.isDeleteModalVisible = true;
    }

    closeDeleteModal(): void {
        this.isDeleteModalVisible = false;
    }
}
