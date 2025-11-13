import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';


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

    constructor(
        private router: Router,
        private stupidService: StupidDataService
    ) { }

    ngOnInit(): void {

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
