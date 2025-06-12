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
 * This program is distributed in the hope that it8 will be useful, but WITHOUT
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

import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnDestroy,
    OnInit,
    signal,
    ViewChild,
    WritableSignal
} from '@angular/core';
import {combineLatestWith, Observable, Subscription} from 'rxjs';
import {filter, map, take} from 'rxjs/operators';
import {NavbarModel} from '../navbar-model';
import {NavbarAbstract} from '../navbar.abstract';
import {transition, trigger, useAnimation} from '@angular/animations';
import {backInDown} from 'ng-animate';
import {ActionNameMapper} from '../../../services/navigation/action-name-mapper/action-name-mapper.service';
import {SystemConfigStore} from '../../../store/system-config/system-config.store';
import {ModuleAction, Navigation, NavigationStore} from '../../../store/navigation/navigation.store';
import {UserPreferenceMap, UserPreferenceStore} from '../../../store/user-preference/user-preference.store';
import {
    ScreenSize,
    ScreenSizeObserverService
} from '../../../services/ui/screen-size-observer/screen-size-observer.service';
import {RouteConverter} from '../../../services/navigation/route-converter/route-converter.service';
import {LanguageStore, LanguageStrings} from '../../../store/language/language.store';
import {ModuleNavigation} from '../../../services/navigation/module-navigation/module-navigation.service';
import {ModuleNameMapper} from '../../../services/navigation/module-name-mapper/module-name-mapper.service';
import {AppState, AppStateStore} from '../../../store/app-state/app-state.store';
import {AuthService} from '../../../services/auth/auth.service';
import {ready} from '../../../common/utils/object-utils';
import {MenuItem} from '../../../common/menu/menu.model';
import {RecentlyViewed} from '../../../common/record/recently-viewed.model';
import {AsyncActionInput, AsyncActionService} from '../../../services/process/processes/async-action/async-action';
import {NotificationStore} from "../../../store/notification/notification.store";
import {GlobalRecentlyViewedStore} from "../../../store/global-recently-viewed/global-recently-viewed.store";
import {GlobalSearch} from "../../../services/navigation/global-search/global-search.service";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {SearchBarComponent} from "../../search-bar/search-bar.component";
import {NavigationEnd, Router} from "@angular/router";
import {NgbDropdown} from "@ng-bootstrap/ng-bootstrap";

import {StupidDataService} from '../../../services/stupid-data/stupid-data.service'; // Alien code 6754

@Component({
    selector: 'scrm-base-navbar',
    templateUrl: './base-navbar.component.html',
    styleUrls: [],
    animations: [
        trigger('mobileSearchBarAnm', [
            transition(':enter', useAnimation(backInDown, {
                params: {timing: 0.5, delay: 0}
            })),
        ])
    ]
})
export class BaseNavbarComponent implements OnInit, OnDestroy, AfterViewInit {
    // Alien Code Block 6754 - Start
    ln_open = true;
    ln_all_clicked = false;
    submenu_items: any[] = [];
    current_submenu_items: any[] = [];
    @ViewChild('lnBody') lnBody!: ElementRef;

    // listSubMenu(arr: any[] = []): void {
    //     this.submenu_items = arr;
    //     //console.log('Array set:', this.submenu_items);

    //     // Scroll to Top
    //     if (this.lnBody) {
    //         this.lnBody.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
    //     }
    // }

    defaultModuleIcons: string[] = [
        'Accounts', 'Contacts', 'Opportunities', 'Leads', 'AOS_Quotes', 'Calendar', 'Documents', 
        'Emails', 'Campaigns', 'Calls', 'Meetings', 'Tasks', 'Notes', 'AOS_Invoices', 
        'AOS_Contracts', 'Cases', 'Prospects', 'ProspectLists', 'Project', 'AM_ProjectTemplates', 
        'FP_events', 'FP_Event_Locations', 'AOS_Products', 'AOS_Product_Categories', 
        'AOS_PDF_Templates', 'AOR_Reports', 'AOK_KnowledgeBase', 'AOK_Knowledge_Base_Categories', 
        'EmailTemplates', 'Surveys'
    ];

    listSubMenu(arr?: any[]): void {
        //console.log('arr:', arr, 'arr length:', arr ? arr.length : 'undefined');
        this.submenu_items = (arr && arr.length > 0) ? arr : ['2home2'];
        this.current_submenu_items = this.submenu_items;
        this.ln_open = true;
        //console.log('arr set:', this.submenu_items);
        // Scroll to Top
        if (this.lnBody) {
            this.lnBody.nativeElement.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    showTempSubMenu(arr?: any[]): void {
        this.current_submenu_items = this.submenu_items;
        this.submenu_items = (arr && arr.length > 0) ? arr : ['2home2'];
    }

    hideTempSubMenu(): void {
        this.submenu_items = this.current_submenu_items;
    }

    // activeModuleMenu(event: MouseEvent) {
    //     const target = event.target as HTMLElement;
    //     // Reset all background colors
    //     document.querySelectorAll('.ln-bl-items').forEach((el) => {
    //         (el as HTMLElement).style.backgroundColor = '';
    //     });

    //     // Set background color of the clicked div
    //     target.style.backgroundColor = 'lightblue';
    // }

    activeIndex: number | null = null;
    activeAll: number | null = null;
    

    activeModuleMenu(event: MouseEvent) {
        const target = event.target as HTMLElement;
        const parentDiv = target.closest('.ln-bl-module-menu') as HTMLElement;
        
        // Find the index of the clicked div
        const allItems = Array.from(document.querySelectorAll('.ln-bl-module-menu'));
        this.activeIndex = allItems.indexOf(parentDiv);

        this.activeAll = null;
    }

    activeAllMenu() {
        this.activeIndex = null;
        this.activeAll = 1;
    }

    resetActiveState() {
        this.activeIndex = null;
        this.activeAll = null;
        this.retrievedArray = null;
        localStorage.setItem('myArrayData', JSON.stringify(null));
    }


    // Another strategy to highlight the active submenu item
    // activeIndexSubmenu: number | null = null;

    // resetActiveStateOfSubmenu() {
    //     this.activeIndexSubmenu = null;
    // }

    // activeModuleMenuSubmenu(event: MouseEvent) {
    //     const target = event.target as HTMLElement;
    //     const parentDiv = target.closest('.ln-bl-module-menu-submenu') as HTMLElement;

    //     //parentDiv.classList.add('active');

    //     // Find the index of the clicked div
    //     const allItems = Array.from(document.querySelectorAll('.ln-bl-module-menu-submenu'));
    //     this.activeIndexSubmenu = allItems.indexOf(parentDiv);
    // }

    openSubMenu(): void {
        this.ln_open = true;
    }

    showAllModules() {
        this.ln_all_clicked = true;
    }

    toggleLeftNav() {
        this.ln_open = !this.ln_open;
    }

    setCurrentModuleFilter(item: any) {
        //localStorage.setItem('myArrayData', JSON.stringify(item));
        this.retrievedArray = item;
    }

    saveToLocalStorage() {
        // Save the array to local storage
        localStorage.setItem('myArrayData', JSON.stringify(this.retrievedArray));
    }

    // Alien Code Block 6754 - End


    @ViewChild('mobileGlobalLinkTitle') mobileGlobalLinkTitle: ElementRef;
    @ViewChild('searchTerm', { static: false }) searchTermRef: SearchBarComponent;
    @ViewChild('alertDropdown') alertDropdown: NgbDropdown;

    protected static instances: BaseNavbarComponent[] = [];

    loaded = true;
    isUserLoggedIn: boolean;
    mainNavCollapse = true;
    subNavCollapse = true;
    mobileSubNav = false;
    backLink = false;
    mainNavLink = true;
    submenu: any = [];
    moduleNameMapper = new ModuleNameMapper(this.systemConfigStore);
    actionNameMapper = new ActionNameMapper(this.systemConfigStore);
    routeConverter = new RouteConverter(this.moduleNameMapper, this.actionNameMapper, this.systemConfigStore);
    navbar: NavbarModel;
    maxTabs = 1000; // Alien code 6754 changed value from 8 to 1000
    screen: ScreenSize = ScreenSize.Medium;
    notificationsEnabled: WritableSignal<boolean> = signal<boolean>(false);
    subs: Subscription[] = []
    navigation: Navigation;
    mobileNavbar = false;
    isSmallScreen = signal<boolean>(false);
    isTabletScreen = signal<boolean>(false);
    dropdownLength: number;
    recentlyViewedCount: number = 10;

    currentQuickActions: ModuleAction[];
    isSearchBoxVisible = signal<boolean>(false);

    languages$: Observable<LanguageStrings> = this.languageStore.vm$;
    userPreferences$: Observable<UserPreferenceMap> = this.userPreferenceStore.userPreferences$;
    currentUser$: Observable<any> = this.authService.currentUser$;
    appState$: Observable<AppState> = this.appState.vm$;
    navigation$: Observable<Navigation> = this.navigationStore.vm$;
    recentlyViewed$: Observable<RecentlyViewed[]> = this.globalRecentlyViewedStore.globalRecentlyViewed$;

    notificationCount$: Observable<number>;

    vm$ = this.navigation$.pipe(
        combineLatestWith(
            this.userPreferences$,
            this.currentUser$,
            this.appState$,
            this.screenSize.screenSize$,
            this.languages$,
        ),
        map(([navigation, userPreferences, currentUser, appState, screenSize, language]) => {

            if (screenSize) {
                this.screen = screenSize;
                this.onResize();
            }

            if (navigation && navigation.modules) {
                this.navigation = navigation;
            }

            //this.calculateMaxTabs(navigation);

            this.getModuleQuickActions(appState.module);

            this.navbar.resetMenu();
            if (ready([language.appStrings, language.modStrings, language.appListStrings, userPreferences, currentUser])) {
                this.navbar.build(
                    navigation,
                    currentUser,
                    this.maxTabs,
                );
            }

            return {
                navigation,
                userPreferences,
                appState,
                appStrings: language.appStrings || {},
                appListStrings: language.appListStrings || {}
            };
        })
    );

    constructor(
        protected navigationStore: NavigationStore,
        protected languageStore: LanguageStore,
        protected userPreferenceStore: UserPreferenceStore,
        protected systemConfigStore: SystemConfigStore,
        protected appState: AppStateStore,
        protected authService: AuthService,
        protected moduleNavigation: ModuleNavigation,
        protected screenSize: ScreenSizeObserverService,
        protected asyncActionService: AsyncActionService,
        protected notificationStore: NotificationStore,
        protected globalRecentlyViewedStore: GlobalRecentlyViewedStore,
        protected globalSearch: GlobalSearch,
        protected breakpointObserver: BreakpointObserver,
        protected router: Router,
        private stupidData: StupidDataService
    ) {
    }

    /**
     * Public API
     */

    @HostListener('window:resize', ['$event'])
    onResize(): void {
        const innerWidth = window.innerWidth;
        this.mobileNavbar = innerWidth <= 768;
        this.isSmallScreen.set(innerWidth < 600);
        this.isTabletScreen.set(innerWidth <= 992);
        this.isSearchBoxVisible.set(innerWidth >= 600);
    }

    retrievedArray: any; // Alien code 6754

    ngOnInit(): void {
        const navbar = new NavbarAbstract(
            this.routeConverter,
            this.moduleNavigation,
            this.userPreferenceStore,
            this.languageStore,
            this.appState,
            this.moduleNameMapper
        );
        this.setNavbar(navbar);
        this.authService.isUserLoggedIn.subscribe(value => {
            this.isUserLoggedIn = value;
        });

        window.dispatchEvent(new Event('resize'));

        this.notificationCount$ = this.notificationStore.notificationsUnreadTotal$;

        this.recentlyViewedCount = this.systemConfigStore.getUi('global_recently_viewed');

        this.subs.push(this.notificationStore.notificationsEnabled$.subscribe(notificationsEnabled => {
            this.notificationsEnabled.set(notificationsEnabled);
        }));

        this.subs.push(this.breakpointObserver.observe([
            Breakpoints.XSmall,
        ]).subscribe((result: BreakpointState) => {
            let hasSearchTerm;
            if(!!this.searchTermRef?.searchForm.get('searchTerm').value) {
                hasSearchTerm = true;
            } else {
                hasSearchTerm = false;
            }
            if (result.matches && !hasSearchTerm) {
                this.isSearchBoxVisible.set(false);
            }
        }));

        // Alien Code Block 6754 - start
        //console.log("navbar object is listed below code 6754:");
        //console.log(navbar);
        this.stupidData.setObject(navbar);
        this.stupidData.setRecentlyViewedObject(this.recentlyViewed$);

        const savedData = localStorage.getItem('myArrayData');
        if (savedData) {
            this.retrievedArray = JSON.parse(savedData);
        } else {
            this.retrievedArray = [];  // or some default value
        }

        //console.log('retrievedArray is listed below code 6754:');
        //console.log(this.retrievedArray);
        //this.sendData();
        //console.log('recentlyViewed is listed below code 6754:');
        //console.log(this.recentlyViewed$);

        this.submenu_items = ['2refresh2'];

        //console.log('currentQuickActions in actionnnnnnnnnnnnnnnn', this.currentQuickActions);
        // Alien Code Block 6754 - end
    }

    ngOnDestroy(): void {
        this.authService.isUserLoggedIn.unsubscribe();
        this.subs.forEach(sub => sub.unsubscribe());
    }

    // sendData() {
    //     const myObject = { name: 'Angular', version: '16' };
    //     //this.stupidData.setObject(myObject);
    // }

    checkAppStrings(appStrings): boolean {
        return appStrings && Object.keys(appStrings).length > 0;
    }

    arePreferencesInitialized(preferences: UserPreferenceMap) {
        return preferences && Object.keys(preferences).length;
    }

    markAsRead(): void {
        this.notificationStore.markNotificationsAsRead();
    }

    ngAfterViewInit(): void {
        if (!this.mobileGlobalLinkTitle?.nativeElement?.offsetWidth) {
            return;
        }
        this.dropdownLength = this.mobileGlobalLinkTitle.nativeElement.offsetWidth;
    }

    /**
     * Change subnavigation
     *
     * @param {object} event triggered
     * @param {object} items
     */
    public changeSubNav(event: Event, items: MenuItem[]): void {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
        this.submenu = items;
    }

    /**
     * Set link flags
     */
    public navBackLink(): void {
        this.mobileSubNav = !this.mobileSubNav;
        this.backLink = !this.backLink;
        this.mainNavLink = !this.mainNavLink;
    }

    /**
     * Get home page
     *
     * @returns {string} homepage
     */
    public getHomePage(): string {
        return this.systemConfigStore.getHomePage();
    }

    /**
     * Internal API
     */

    /**
     * Set navbar model
     *
     * @param {object} navbar model
     */
    protected setNavbar(navbar: NavbarModel): void {
        this.navbar = navbar;
        this.loaded = true;
    }

    /**
     * Check if is loaded
     *
     * @returns {{boolean}} is loaded
     */
    protected isLoaded(): boolean {
        return this.loaded;
    }

    protected calculateMaxTabs(navigation: Navigation): void {
        const sizeMap = this.systemConfigStore.getConfigValue('navigation_tab_limits');
        if (this.screen && sizeMap) {

            let maxTabs = sizeMap[this.screen];
            if (!maxTabs || navigation.maxTabs && navigation.maxTabs < maxTabs) {
                maxTabs = navigation.maxTabs;
            }

            this.maxTabs = maxTabs;
        }
    }

    getModuleQuickActions(module: string): void {
        const moduleNavigation = this?.navigation?.modules[module] ?? null;
        const moduleNavigationMenu = moduleNavigation?.menu ?? [];
        if (moduleNavigation === null || !moduleNavigationMenu.length) {
            this.currentQuickActions = [];
        }

        const actions = [] as ModuleAction[];

        moduleNavigationMenu.forEach(entry => {
            if (!entry.url || !entry.quickAction) {
                return;
            }

            const url = entry?.url ?? '';

            actions.push({
                ...entry,
                url: url.replace('/#/', '/')
            } as ModuleAction);
        });

        this.currentQuickActions = actions;
    }

    handleProcess(action: ModuleAction) {
        if (!action.process) {
            return;
        }

        const processType = action.process;

        const options = {
            action: processType,
            module: action.module,
        } as AsyncActionInput;

        this.asyncActionService.run(processType, options).pipe(take(1)).subscribe();
    }

    openSearchBox() {
        if(this.isSmallScreen()) {
            this.isSearchBoxVisible.set(true);
        }
    }

    closeSearchBox(isVisible: boolean) {
        this.isSearchBoxVisible.set(isVisible);
    }

    search(searchTerm: string) {
        const searchController = this.systemConfigStore.getConfigValue('search')?.controller ?? '';
        this.globalSearch.navigateToSearch(searchTerm, searchController).finally();
    }

    toggleSidebar(): void {
        this.appState.toggleSidebar();
    }

    closeNotificationMenu() {
        this.subs.push(this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            take(1)
        ).subscribe(() => {
            this.alertDropdown.close();
        }));
    }
}
