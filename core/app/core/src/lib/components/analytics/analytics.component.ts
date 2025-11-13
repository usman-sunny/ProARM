import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
    selector: 'scrm-analytics',
    templateUrl: 'analytics.component.html'
})
export class AnalyticsComponent implements OnInit, OnDestroy {
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
     * Navigate back to home page
     */
    navigateToHome(): void {
        this.router.navigate(['/home']);
    }
    
    /**
     * Navigate back to home page
     */
    navigateToWorkspace(): void {
        this.router.navigate(['/pd_collections']);
    }

    /**
     * Set active tab
     * @param tab Tab name to activate
     */
    setActiveTab(tab: string): void {
        this.activeTab = tab;
    }
    
} 