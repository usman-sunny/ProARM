import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'scrm-analytics-delete-modal',
    templateUrl: './analytics-delete-modal.component.html'
})
export class AnalyticsDeleteModalComponent implements OnInit {

    collectionId: string = '';
    @Output() closeModal = new EventEmitter<void>();
    @Input() deleteId: string = '';
    @Input() deleteType: string = '';
    
    constructor(
        private stupidService: StupidDataService,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    ngOnInit(): void {
        this.collectionId = this.route.parent?.snapshot.paramMap.get('collectionId');
    }

    closeModalWindow(): void {
        this.closeModal.emit();
    }

    delete(): void {
        if (this.deleteType === 'report') {
            this.stupidService.nltDeleteReport({report_id: this.deleteId}).subscribe(value => {
                if (value.success) {
                    this.router.navigate(['/pd_collections', this.collectionId]);
                    alert('Report deleted successfully');
                }
            });
        }

        if (this.deleteType === 'dashboard') {
            this.stupidService.nltDeleteDashboard({dashboard_id: this.deleteId}).subscribe(value => {
                if (value.success) {
                    this.router.navigate(['/pd_collections', this.collectionId]);
                    alert('Dashboard deleted successfully');
                }
            });
        }

        if (this.deleteType === 'collection') {
            this.stupidService.nltDeleteCollection({collection_id: this.deleteId}).subscribe(value => {
                if (value.success) {
                    this.router.navigate(['/pd_analytics']);
                    alert('Collection deleted successfully');
                }
            });
        }
    }
}
