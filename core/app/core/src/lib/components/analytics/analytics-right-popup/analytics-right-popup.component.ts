import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'scrm-analytics-right-popup',
    templateUrl: './analytics-right-popup.component.html'
})
export class AnalyticsRightPopupComponent implements OnInit {

    @Input() popupType: string = '';
    @Input() listItems: any[] = [];

    @Output() closeRightPopup = new EventEmitter<string>();

    isMiniPopupVisible: boolean = false;
    isReportModalVisible: boolean = false;
    collectionId: string = '';

    constructor(
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.collectionId = this.route.snapshot.paramMap.get('collectionId');
    }

    toggleMiniPopup(): void {
        if (this.popupType === 'reports') {
            this.isMiniPopupVisible = !this.isMiniPopupVisible;
        }
    }

    openReportModal(reportType: string): void {
        this.isReportModalVisible = true;
        this.isMiniPopupVisible = false;
    }

    closeReportModal(): void {
        this.isReportModalVisible = false;
        this.closeRightPopup.emit();
    }

}
