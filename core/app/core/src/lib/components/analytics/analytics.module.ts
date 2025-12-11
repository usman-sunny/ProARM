import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxEchartsModule} from 'ngx-echarts';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AnalyticsComponent} from './analytics.component';
import {AnalyticsWorkspaceComponent} from './analytics-workspace/analytics-workspace.component';
import {AnalyticsWorkspaceBodyComponent} from './analytics-workspace/analytics-workspace-body.component';
import {AnalyticsTopNavComponent} from './analytics-top-nav/analytics-top-nav.component';
import {AnalyticsBaseNavComponent} from './analytics-base-nav/analytics-base-nav.component';
import {AnalyticsRightPopupComponent} from './analytics-right-popup/analytics-right-popup.component';
import {AnalyticsCreateDashboardComponent} from './analytics-create-dashboard/analytics-create-dashboard.component';
import {AnalyticsCreateReportComponent} from './analytics-create-report/analytics-create-report.component';
import {AnalyticsReportModalComponent} from './analytics-report-modal/analytics-report-modal.component';
import {ViewReportComponent} from './analytics-view-report/analytics-view-report.component';
import {AnalyticsChartComponent} from './analytics-chart/analytics-chart.component';
import {AnalyticsViewDashboardComponent} from './analytics-view-dashboard/analytics-view-dashboard.component';
import {ImageModule} from '../image/image.module';

@NgModule({
    declarations: [
        AnalyticsComponent, 
        AnalyticsWorkspaceComponent,
        AnalyticsWorkspaceBodyComponent,
        AnalyticsTopNavComponent,
        AnalyticsBaseNavComponent,
        AnalyticsRightPopupComponent,
        AnalyticsCreateDashboardComponent,
        AnalyticsCreateReportComponent,
        AnalyticsReportModalComponent,
        ViewReportComponent,
        AnalyticsChartComponent,
        AnalyticsViewDashboardComponent,
    ],
    exports: [
        AnalyticsComponent, 
        AnalyticsWorkspaceComponent,
        AnalyticsWorkspaceBodyComponent,
        AnalyticsTopNavComponent,
        AnalyticsBaseNavComponent,
        AnalyticsRightPopupComponent,
        AnalyticsCreateDashboardComponent,
        AnalyticsCreateReportComponent,
        AnalyticsReportModalComponent,
        ViewReportComponent,
        AnalyticsChartComponent,
        AnalyticsViewDashboardComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        ImageModule,
        DragDropModule,
        RouterModule,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }),
        NgbModule,
    ]
})
export class AnalyticsModule {
} 