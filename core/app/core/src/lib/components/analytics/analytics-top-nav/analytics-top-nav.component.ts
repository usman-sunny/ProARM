import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'scrm-analytics-top-nav',
    templateUrl: 'analytics-top-nav.component.html'
})
export class AnalyticsTopNavComponent implements OnInit, OnDestroy {
    protected subs: Subscription[] = [];
    
    // Search functionality
    searchQuery: string = '';
    
    // Tab navigation
    activeTab: string = 'workspaces';
    

    constructor(
        private router: Router
    ) {
    }

    ngOnInit(): void {
        
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
