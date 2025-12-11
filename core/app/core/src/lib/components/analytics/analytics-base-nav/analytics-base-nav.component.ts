import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Subscription, tap} from 'rxjs';
import {StupidDataService} from '../../../services/stupid-data/stupid-data.service';

@Component({
    selector: 'scrm-analytics-base-nav',
    templateUrl: 'analytics-base-nav.component.html'
})
export class AnalyticsBaseNavComponent implements OnInit, OnDestroy {
    protected subs: Subscription[] = [];
    
    collectionId: string = '';
    // Tab navigation
    //activeTab: string = 'workspaces';
    
    popupType: string = '';
    isPopupVisible: boolean = false;

    listItems: any[] = [];
    dashboards: any[] = [];
    reports: any[] = [];
    tables: any[] = [];


    constructor(
        private router: Router,
        private stupidService: StupidDataService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.collectionId = this.route.snapshot.paramMap.get('collectionId');

        this.subs.push(this.stupidService.nltGetAllReports({collectionId: this.collectionId}).subscribe(data => {
            this.reports = data;
        }));

        this.subs.push(this.stupidService.nltGetAllDashboards(this.collectionId).pipe(
            tap((data: any[]) => {
                this.dashboards = data;
            })
        ).subscribe());

        this.tables = [
            {
                id: 1,
                name: 'Table A',
                picture: 'cstm-nlt-data'
            },
            {
                id: 2,
                name: 'Table B',
                picture: 'cstm-nlt-data'
            },
            {
                id: 3,
                name: 'Table C',
                picture: 'cstm-nlt-data'
            }
        ];

    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    togglePopup(type: string): void {
        
        if (this.popupType === type) {
            this.popupType = '';
            this.isPopupVisible = false;
            return;
        }
        else {
            
            if (type === 'dashboards') {
                this.listItems = this.dashboards;
            } else if (type === 'reports') {
                this.listItems = this.reports;
            } else if (type === 'tables') {
                this.listItems = this.tables;
            }

            this.popupType = type;
            this.isPopupVisible = true;
        }
        
        // this.isPopupVisible = !this.isPopupVisible;
    }

    closeRightPopup(): void {
        this.isPopupVisible = false;
        this.popupType = '';
    }

}
