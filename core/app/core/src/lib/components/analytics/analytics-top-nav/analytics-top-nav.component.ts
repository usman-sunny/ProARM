import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, Subscription, tap} from 'rxjs';
import {StupidDataService} from '../../../services/stupid-data/stupid-data.service';

@Component({
    selector: 'scrm-analytics-top-nav',
    templateUrl: 'analytics-top-nav.component.html'
})
export class AnalyticsTopNavComponent implements OnInit, OnDestroy {
    protected subs: Subscription[] = [];
    searchQuery: string = '';
    activeTab: string = 'workspaces';
    collectionId: string = '';
    activeCollection: any = null;
    collections$!: Observable<any>;

    constructor(
        private router: Router,
        private stupidService: StupidDataService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.collectionId = this.route.snapshot.paramMap.get('collectionId');

        this.collections$ = this.stupidService.nltGetCollections().pipe(
            tap(data => {
                this.activeCollection = data.collections.find(
                    collection => collection.id === this.collectionId
                );
            })
        );
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
    
    /**
     * Navigate back to analytics home page
     */
    navigateToAnalyticsHome(): void {
        this.router.navigate(['/pd_analytics']);
    }
    
    /**
     * Set active tab
     * @param tab Tab name to activate
     */
    setActiveTab(tab: string): void {
        this.activeTab = tab;
    }

}
