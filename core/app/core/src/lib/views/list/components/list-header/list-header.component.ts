
/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2021 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ListViewStore} from '../../store/list-view/list-view.store';
import {FilterAdapter} from '../../adapters/filter.adapter';
import {ModuleNavigation} from '../../../../services/navigation/module-navigation/module-navigation.service';
import {RecordPanelConfig} from '../../../../containers/record-panel/components/record-panel/record-panel.model';
import {Subscription} from 'rxjs';
import {RecordPanelAdapter} from '../../adapters/record-panel.adapter';
import {QuickFiltersService} from "../../services/quick-filters.service";
import {isTrue} from '../../../../common/utils/value-utils';
import {debounceTime, distinctUntilChanged, Subject} from 'rxjs';
import {SearchCriteria} from '../../../../common/views/list/search-criteria.model';
import {SavedFilter} from '../../../../store/saved-filters/saved-filter.model';

import {StupidDataService} from '../../../../services/stupid-data/stupid-data.service';
import {boolean} from 'mathjs';

@Component({
    selector: 'scrm-list-header',
    templateUrl: 'list-header.component.html',
    providers: [FilterAdapter, RecordPanelAdapter],
})
export class ListHeaderComponent implements OnInit, OnDestroy {

    actionPanel = '';
    recordPanelConfig: RecordPanelConfig;
    showQuickFilters = false;
    enableQuickFilters = false;
    protected subs: Subscription[] = [];
    filterBtn = false;
    navbar: any;

    // Global search properties
    searchText: string = '';
    private searchSubject = new Subject<string>();
    private searchDebounceTime = 500; // milliseconds

    insightsBtn: { [key: string]: any } = {
        isEnabled: false,
    };

    count: number = 0;
    private countSubscription: Subscription;
    bulkActions: any;

    constructor(
        public filterAdapter: FilterAdapter,
        protected listStore: ListViewStore,
        protected moduleNavigation: ModuleNavigation,
        protected recordPanelAdapter: RecordPanelAdapter,
        public quickFilters: QuickFiltersService,
        protected stupidDataService: StupidDataService,
    ) {
    }

    get moduleTitle(): string {
        const module = this.listStore.vm.appData.module;
        const appListStrings = this.listStore.vm.appData.language.appListStrings;
        return this.moduleNavigation.getModuleLabel(module, appListStrings);
    }

    ngOnInit(): void {
        this.listStore.actionPanel$.subscribe(actionPanel => {
            this.actionPanel = actionPanel;
            if (this.actionPanel === 'recordPanel') {
                this.recordPanelConfig = this.recordPanelAdapter.getConfig();
            } else {
                this.recordPanelConfig = null;
            }
        });

        this.subs.push(this.quickFilters.breakdown$.subscribe(breakdown => {
            this.showQuickFilters = isTrue(breakdown);
        }))

        this.subs.push(this.quickFilters.enabled$.subscribe(enabled => {
            this.enableQuickFilters = isTrue(enabled ?? false);
        }))

        this.stupidDataService.setInsightsObject(this.insightsBtn);

        // Subscribe to the count$ observable from the stupidDataService
        this.countSubscription = this.stupidDataService.count$.subscribe(
            (updatedCount: number) => {
                this.count = updatedCount; // Update the count value
            }
        );

        // bulk actions object from bulk-action-menu.component through stupid data service
        this.stupidDataService.bulkActionButtonsObject$.subscribe(value => {
            this.bulkActions = value;
        });

        this.stupidDataService.object$.subscribe(navbar => {
            this.navbar = navbar;
        });

        // Initialize global search with debouncing
        this.subs.push(
            this.searchSubject.pipe(
                debounceTime(this.searchDebounceTime),
                distinctUntilChanged()
            ).subscribe(searchTerm => {
                this.performGlobalSearch(searchTerm);
            })
        );

    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
        if (this.countSubscription) {
            this.countSubscription.unsubscribe();
        }
        this.recordPanelConfig = null;
    }

    toggleFilters(): void {
        this.filterBtn = !this.filterBtn;
    }

    toggleInsights(): void {
       this.insightsBtn.isEnabled = !this.insightsBtn.isEnabled;
    }

    click(click: Function): void {
        if (click) {
            click();
        }
    }

    /**
     * Handle search input changes with debouncing
     */
    onSearchInputChange(event: Event): void {
        const target = event.target as HTMLInputElement;
        const searchTerm = target.value?.trim() || '';
        
        // Update the searchText property
        this.searchText = searchTerm;
        
        this.searchSubject.next(searchTerm);
    }

    /**
     * Perform global search across common fields
     */
    performGlobalSearch(searchTerm?: string): void {
        // Use the parameter directly since it comes from the debounced subject
        const term = searchTerm || '';
        
        if (!term) {
            this.clearGlobalSearch();
            return;
        }

        this.applyFilterAdapterSearch(term);
    }

    /**
     * Apply search filter using the filter adapter
     */
    private applyFilterAdapterSearch(searchTerm: string): void {
        const searchCriteria: SearchCriteria = {
            name: 'global_search',
            filters: {
                'name': {
                    field: 'name',
                    operator: '=',
                    values: [searchTerm]
                }
            },
            // ADD FLAG TO INDICATE THIS IS FROM SEARCH BOX
            searchType: 'global_search_box'
        };

        const filterSearchFilter: SavedFilter = {
            key: 'global_search',
            module: 'saved-search',
            attributes: {
                id: 'global_search',
                name: 'Global Search',
                contents: {
                    searchTerm: searchTerm,
                    searchType: 'global_search_box'
                },
                search_module: this.listStore.getModuleName()
            },
            fields: {
                name: {
                    name: 'name',
                    type: 'varchar'
                }
            },
            criteria: searchCriteria,
            criteriaFields: {
                'name': {
                    name: 'name',
                    type: 'varchar',
                    value: searchTerm,
                    label: 'Name',
                    labelKey: 'LBL_NAME'
                }
            }
        };

        try {
            this.filterAdapter.getConfig().updateFilter(filterSearchFilter, true);
        } catch (error) {

            try {
                // Create a simple filter map
                const fallbackFilters = {
                    'global_search': {
                        key: 'global_search',
                        module: 'saved-search',
                        criteria: searchCriteria,
                        attributes: { contents: searchTerm }
                    }
                };
                this.listStore.setFilters(fallbackFilters, true);
            } catch (fallbackError) {
                console.error('Fallback approach also failed:', fallbackError);
            }
        }
    }

    /**
     * Clear global search and reset to default filters
     */
    private clearGlobalSearch(): void {
        this.searchText = '';
        
        try {
            this.filterAdapter.getConfig().resetFilter(true);
        } catch (error) {
            console.error('Error resetting filters:', error);
            this.listStore.resetFilters(true);
        }
    }

}
