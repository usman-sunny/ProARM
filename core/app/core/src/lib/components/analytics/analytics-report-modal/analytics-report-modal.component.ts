import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';
import { ActivatedRoute } from '@angular/router';
import { map, take } from 'rxjs/operators'; 
import { BehaviorSubject } from 'rxjs';

@Component({
    selector: 'scrm-analytics-report-modal',
    templateUrl: './analytics-report-modal.component.html'
})
export class AnalyticsReportModalComponent implements OnInit {

    collectionId: string = '';
    @Output() closeModal = new EventEmitter<void>();

    modules$ = this.stupidService.nltAllModules$;
    searchModule: string = '';
    filteredModules$ = new BehaviorSubject<any[]>([]);
    selectedModuleName: string = '';
    selectedModuleLabel: string = '';

    constructor(
        private stupidService: StupidDataService,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.collectionId = this.route.snapshot.paramMap.get('collectionId');

        this.stupidService.getNltAllModules().subscribe(mods => {
            this.filteredModules$.next(mods);
        });
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

    searchModules(): void {
        const term = this.searchModule.toLowerCase().trim();

        this.modules$
            .pipe(take(1))
            .subscribe(modules => {
                const filtered = modules.filter(m => 
                    m.label?.toLowerCase().includes(term)
                );
                this.filteredModules$.next(filtered);
            });
    }

}
