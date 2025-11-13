import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';

@Component({
    selector: 'scrm-analytics-report-modal',
    templateUrl: './analytics-report-modal.component.html'
})
export class AnalyticsReportModalComponent implements OnInit {

    @Output() closeModal = new EventEmitter<void>();

    modules$ = this.stupidService.nltAllModules$;
    selectedModuleName: string = '';
    selectedModuleLabel: string = '';

    constructor(
        private stupidService: StupidDataService,
    ) { }

    ngOnInit(): void {

        this.stupidService.getNltAllModules().subscribe();
    }

    createNewReport(): void {
        if (this.selectedModuleName && this.selectedModuleLabel) {
            const data = {
                moduleName: this.selectedModuleName,
                chartlabel: this.selectedModuleLabel,
                type: 'reports',
            };
            this.stupidService.nltNewReport(data);
        }
        
        this.closeModalWindow();
    }

    closeModalWindow(): void {
        this.closeModal.emit();
    }

    selectModule(name: string, label: string): void {
        this.selectedModuleName = name;
        this.selectedModuleLabel = label;
    }

}
