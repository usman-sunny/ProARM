import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {StupidDataService} from '../../../services/stupid-data/stupid-data.service';

@Component({
    selector: 'analytics-workspace-body',
    templateUrl: './analytics-workspace-body.component.html',
})
export class AnalyticsWorkspaceBodyComponent implements OnInit, OnDestroy {
    protected subs: Subscription[] = [];
    wspaces: any[] = [];

    constructor(
        private stupidService: StupidDataService,
    ) {
    }

    ngOnInit(): void {

        this.wspaces = [
            {
                id: 1,
                name: 'Workspace 1',
                picture: 'cstm_nlt_ph1',
                lastModified: 'Yesterday'
            },
            {
                id: 2,
                name: 'Dashboard B',
                picture: 'cstm_nlt_ph2',
                lastModified: '2 days ago'
            },
            {
                id: 3,
                name: 'Report A',
                picture: 'cstm_nlt_ph3',
                lastModified: '3 days ago'
            },
            {
                id: 4,
                name: 'Accounts',
                picture: 'cstm_nlt_ph1',
                lastModified: '4 days ago'
            },
            {
                id: 5,
                name: 'Accounts 2',
                picture: 'cstm_nlt_ph1',
                lastModified: '4 days ago'
            },
            {
                id: 6,
                name: 'Accounts 3',
                picture: 'cstm_nlt_ph1',
                lastModified: '4 days ago'
            }
        ];
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

}
