import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {StupidDataService} from '../../services/stupid-data/stupid-data.service';

@Component({
    selector: 'scrm-analytics',
    templateUrl: 'analytics.component.html'
})
export class AnalyticsComponent implements OnInit, OnDestroy {
    protected subs: Subscription[] = [];
    
    searchQuery: string = '';
    activeTab: string = 'collections';
    collectionName: string = '';
    collectionNameError: boolean = false;
    isCollectionPopupVisible: boolean = false;
    collections$ = this.stupidService.nltGetCollections$;
    isDeleteModalVisible: boolean = false;
    collectionId: string = '';

    constructor(
        private router: Router,
        private stupidService: StupidDataService,
    ) {
    }

    ngOnInit(): void {
        this.listAllCollections();
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
    navigateToCollection(collectionId: string): void {
        this.router.navigate(['/pd_collections', collectionId]);
    }

    /**
     * Set active tab
     * @param tab Tab name to activate
     */
    setActiveTab(tab: string): void {
        this.activeTab = tab;
    }

    /**
     * Open collection popup
     */
    openCollectionPopup(): void {
        this.isCollectionPopupVisible = true;
    }

    /**
     * Close collection popup
     */
    closeCollectionPopup(): void {
        this.isCollectionPopupVisible = false;
        this.collectionName = '';
        this.collectionNameError = false;
    }
    
    /**
     * Create collection
     */
    createCollection(): void {
        if (this.collectionName.trim() !== '') {
            const data = {
                collectionName: this.collectionName,
            };
    
            this.stupidService.nltCreateCollection(data).subscribe(value => {
                console.log('response createCollection value: ', value);
            });
    
            this.closeCollectionPopup();
            this.listAllCollections();
        }
        else {
            this.collectionNameError = true;
        }
    }

    listAllCollections(): void {
        this.subs.push(this.stupidService.nltGetCollections().subscribe(value => {
            console.log('response getCollections value: ', value);
        }));
    }

    openDeleteModal(event: Event, id: string): void {
        event.stopPropagation();
        this.collectionId = id;
        this.isDeleteModalVisible = true;
    }

    closeDeleteModal(): void {
        this.isDeleteModalVisible = false;
        this.collectionId = '';
    }
} 