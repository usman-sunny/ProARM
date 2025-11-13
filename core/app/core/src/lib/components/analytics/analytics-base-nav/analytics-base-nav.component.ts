import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {StupidDataService} from '../../../services/stupid-data/stupid-data.service';

@Component({
    selector: 'scrm-analytics-base-nav',
    templateUrl: 'analytics-base-nav.component.html'
})
export class AnalyticsBaseNavComponent implements OnInit, OnDestroy {
    protected subs: Subscription[] = [];
    
    
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
        private stupidService: StupidDataService
    ) {
    }

    ngOnInit(): void {

        this.subs.push(this.stupidService.nltGetAllReports({id: 1}).subscribe(data => {
            this.reports = data;
        }));

        this.dashboards = [
            {
                id: 1,
                name: 'Dashboard A',
                picture: 'cstm-nlt-ph2'
            },
            {
                id: 2,
                name: 'Dashboard B',
                picture: 'cstm-nlt-ph2'
            },
            {
                id: 3,
                name: 'Dashboard C',
                picture: 'cstm-nlt-ph2'
            }
        ];


        // this.reports = [
        //     {
        //         id: 1,
        //         name: 'Report A',
        //         picture: 'cstm-nlt-reports'
        //     },
        //     {
        //         id: 2,
        //         name: 'Report B',
        //         picture: 'cstm-nlt-reports'
        //     },
        //     {
        //         id: 3,
        //         name: 'Report C',
        //         picture: 'cstm-nlt-reports'
        //     }
        // ];

        //console.log("log 6754 static reports: ", this.reports);

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
