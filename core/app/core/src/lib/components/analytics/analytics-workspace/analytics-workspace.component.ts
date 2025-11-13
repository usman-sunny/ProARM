import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
    selector: 'analytics-workspace',
    templateUrl: './analytics-workspace.component.html',
})
export class AnalyticsWorkspaceComponent implements OnInit, OnDestroy {
    protected subs: Subscription[] = [];

    constructor(
    ) {
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    
}
