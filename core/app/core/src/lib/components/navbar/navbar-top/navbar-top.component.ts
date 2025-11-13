import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';
import { SystemConfigStore } from '../../../store/system-config/system-config.store';
import { GlobalSearch } from "../../../services/navigation/global-search/global-search.service";
import { FormControl, FormGroup, Validators } from '@angular/forms'; 
import { Subscription } from 'rxjs';

@Component({
  selector: 'scrm-navbar-top',
  templateUrl: './navbar-top.component.html',
  styleUrls: []
})
export class NavbarTopComponent implements OnInit, OnDestroy {

    isUserLoggedIn: boolean = false;
    navbar: any;
    recentlyViewed: any;
    searchBoxExpanded: boolean;
    searchForm: FormGroup;

    currentMenuName: string;

    @Output() togglePanel = new EventEmitter<string>();

    private subs: Subscription[] = [];
  
    constructor(
        private authService: AuthService,
        private stupidData: StupidDataService,
        protected systemConfigStore: SystemConfigStore,
        protected globalSearch: GlobalSearch,
    ) {}

    ngOnInit() {
        this.subs.push(this.authService.isUserLoggedIn.subscribe(status => {
            this.isUserLoggedIn = status;
        }));

        // nabvar object from base navbar component through stupid data service
        this.subs.push(this.stupidData.object$.subscribe(navbar => {
            if (navbar) {
                this.navbar = navbar;
                //console.log('Navbar from stupid service:', navbar);
            }
        }));

        // recentlyviewed object from base navbar component through stupid data service
        this.subs.push(this.stupidData.recentlyViewedObject$.subscribe(rc_viewd => {
            this.recentlyViewed = rc_viewd;
            //console.log('rc_viewed from stupid service:', rc_viewd);
        }));

        this.searchForm = new FormGroup({
            searchTerm: new FormControl('', Validators.required),
        });

        this.subs.push(this.stupidData.CurrentMenuNameobject$.subscribe(currentMenuName => {
            this.currentMenuName = currentMenuName;
        }));

        this.searchBoxExpanded = false;
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
  
    toggleRightPanel(name: string) {
        this.togglePanel.emit(name);
    }

    search() {
        const searchController = this.systemConfigStore.getConfigValue('search')?.controller ?? '';
        this.globalSearch.navigateToSearch(this.searchForm.value.searchTerm, searchController).finally();
        this.collapseSearchBox();
    }

    expandSearchBox(event: MouseEvent): void {
        event.stopPropagation();
        this.searchBoxExpanded = true;
    }

    collapseSearchBox(): void {
        this.searchBoxExpanded = false;
        this.searchForm.reset();
    }

    stopClick(event: MouseEvent): void {
        event.stopPropagation();
    }
}   