import {Component, OnDestroy, OnInit, ChangeDetectorRef} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {StupidDataService} from '../../../services/stupid-data/stupid-data.service';

@Component({
    selector: 'analytics-workspace-body',
    templateUrl: './analytics-workspace-body.component.html',
})
export class AnalyticsWorkspaceBodyComponent implements OnInit, OnDestroy {
    protected subs: Subscription[] = [];
    collectionId: string = '';
    collectionData$ = this.stupidService.nltGetCollectionData$;
    //collectionName: string = '';
    //wspaces: any[] = [];

    constructor(
        private stupidService: StupidDataService,
        private route: ActivatedRoute,
        private router: Router,
        //private cdr: ChangeDetectorRef,
    ) {
    }

    ngOnInit(): void {
        this.collectionId = this.route.snapshot.paramMap.get('collectionId');

        if (this.collectionId) {
            this.subs.push(this.stupidService.nltGetCollectionData(this.collectionId).subscribe(value => {
                if (value) {
                    //this.wspaces = value.collectionData || [];
                    //this.collectionName = value.collectionName || '';
                    // this.cdr.markForCheck();
                }
            }));
        }
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    openCard(cardId: string): void {
        this.router.navigate(['/pd_collections', this.collectionId, 'view', cardId]);
    }

}
