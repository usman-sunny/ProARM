import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';

export interface Note {
    title: string | null;
    description: string | null;
    label: string | null;
}

interface ChartResponse {
    title: string | null;
    xAxis: string[] | number[];
    series: string[] | number[];
}

@Injectable({
    providedIn: 'root'
})
export class StupidDataService {

    constructor(private http: HttpClient) {}

    /**
     * Analytics API call 
     * to get collection data
     * 
     * ***/
    private nltGetCollectionDataUrl = 'legacy/index.php?module=pd_analytics&action=nltGetCollectionData&sugar_body_only=true';
    private nltGetCollectionDataObject = new BehaviorSubject<any>(null);
    public nltGetCollectionData$ = this.nltGetCollectionDataObject.asObservable();
    
    nltGetCollectionData(id: any): Observable<any> {
        let params = new HttpParams().set('collectionId', id);
        return this.http.get<any>(this.nltGetCollectionDataUrl, { params }).pipe(
            tap(value => this.nltGetCollectionDataObject.next(value))
        );
    }

    /**
     * Analytics API call 
     * to get all collections
     * 
     * ***/
    private nltGetCollectionsUrl = 'legacy/index.php?module=pd_analytics&action=getCollections&sugar_body_only=true';
    private nltGetCollectionsObject = new BehaviorSubject<any>(null);
    public nltGetCollections$ = this.nltGetCollectionsObject.asObservable();
    
    nltGetCollections(): Observable<any> {
        return this.http.get<any>(this.nltGetCollectionsUrl).pipe(
            tap(value => this.nltGetCollectionsObject.next(value))
        );
    }

    /**
     * Analytics API call 
     * to create collection
     * 
     * ***/
    private nltCreateCollectionUrl = 'legacy/index.php?module=pd_analytics&action=createCollection&sugar_body_only=true';
    private nltCreateCollectionObject = new BehaviorSubject<any>(null);
    public nltCreateCollection$ = this.nltCreateCollectionObject.asObservable();
    
    nltCreateCollection(data: any): Observable<any> {
        return this.http.post<any>(this.nltCreateCollectionUrl, data).pipe(
            tap(value => this.nltCreateCollectionObject.next(value))
        );
    }


    /*** 
     *  Analytics API call 
     *  to get report data
     *  using report id
     * 
     * ***/
    private nltGetReportDataUrl = 'legacy/index.php?module=pd_analytics&action=getReportData&sugar_body_only=true';
    private nltGetReportDataObject = new BehaviorSubject<any>(null);
    public nltGetReportData$ = this.nltGetReportDataObject.asObservable();

    nltGetReportData(id: any): Observable<any> {
        let params = new HttpParams().set('report_id', id);

        return this.http.get<any>(this.nltGetReportDataUrl, { params }).pipe(
            tap(value => this.nltGetReportDataObject.next(value))
        );
    }


    /*** 
     *  Analytics API call 
     *  to get all reports
     * 
     * ***/
    private nltGetAllReportsUrl = 'legacy/index.php?module=pd_analytics&action=nltGetAllReports&sugar_body_only=true';
    private nltGetAllReportsObject = new BehaviorSubject<any>(null);
    public nltGetAllReports$ = this.nltGetAllReportsObject.asObservable();

    nltGetAllReports(data: any): Observable<any> {
        return this.http.post<any>(this.nltGetAllReportsUrl, data).pipe(
            tap(value => this.nltGetAllReportsObject.next(value))
        );
    }


    /*** 
     * Analytics API call 
     * for report detail 
     * view
     * 
     * ***/
    private nltViewReportUrl = 'legacy/index.php?module=pd_analytics&action=viewReport&sugar_body_only=true';
    private nltViewReportObject = new BehaviorSubject<any>(null);
    public nltViewReport$ = this.nltViewReportObject.asObservable();

    nltViewReport(data: any): Observable<any> {
        return this.http.post<any>(this.nltViewReportUrl, data).pipe(
            tap(value => this.nltViewReportObject.next(value))
        );
    }


    /*** 
     * Analytics API call 
     * to save report 
     * 
     * ***/
    private nltSaveReportUrl = 'legacy/index.php?module=pd_analytics&action=saveReport&sugar_body_only=true';
    private nltSaveReportObject = new BehaviorSubject<any>(null);
    public nltSaveReport$ = this.nltSaveReportObject.asObservable();

    nltSaveReport(data: any): Observable<any> {
        return this.http.post<any>(this.nltSaveReportUrl, data).pipe(
            tap(value => this.nltSaveReportObject.next(value))
        );
    }


    /*** 
     * Analytics API call 
     * to create report 
     * 
     * ***/
    private nltCreateReportUrl = 'legacy/index.php?module=pd_analytics&action=createReport&sugar_body_only=true';
    private nltCreateReportObject = new BehaviorSubject<ChartResponse | null>(null);
    public nltCreateReport$ = this.nltCreateReportObject.asObservable();

    getNltCreateReport(data: any): Observable<ChartResponse> {
        //data = JSON.stringify(data);
        //let params = new HttpParams().set('data', data);
        return this.http.post<ChartResponse>(this.nltCreateReportUrl, data).pipe(
            tap(value => this.nltCreateReportObject.next(value))
        );
    }


    /*** 
     * Analytics API call 
     * to get all modules 
     * with labels 
     * 
     * ***/
    private nltAllModulesUrl = 'legacy/index.php?module=pd_analytics&action=getAllModulesWithLabels&sugar_body_only=true';
    private nltAllModulesObject = new BehaviorSubject<any[]>([]);
    public nltAllModules$ = this.nltAllModulesObject.asObservable();

    getNltAllModules(): Observable<any[]> {
        return this.http.get<any[]>(this.nltAllModulesUrl).pipe(
            tap(value => this.nltAllModulesObject.next(value))
        );
    }


    /*** 
     * Analytics API call 
     * to get all fields 
     * and labels for a module 
     * 
     * ***/
    private nltModuleFieldsUrl = 'legacy/index.php?module=pd_analytics&action=getModuleFieldsAndLabels&sugar_body_only=true';
    private nltModuleFieldsObject = new BehaviorSubject<any[]>([]);
    public nltModuleFields$ = this.nltModuleFieldsObject.asObservable();

    getNltModuleFields(moduleName: string): Observable<any[]> {
        let params = new HttpParams().set('module_name', moduleName);
        return this.http.get<any[]>(this.nltModuleFieldsUrl, { params }).pipe(
            tap(value => this.nltModuleFieldsObject.next(value))
        );
    }

    setNltModuleFields(fields: any[]) {
        this.nltModuleFieldsObject.next(fields);
    }


    /*** 
     * create new object 
     * from analytics-right-popup 
     * to analytics-workspace 
     * 
     * ***/
    private nltNewReportSource = new BehaviorSubject<any>(null);
    public nltNewReport$: Observable<any> = this.nltNewReportSource.asObservable();

    nltNewReport(newObject: any) {
        this.nltNewReportSource.next(newObject);
    }


    /*** 
     * Package Key on 
     * module name API 
     * 
     * ***/
    private getPackageKeyUrl = 'legacy/index.php?module=Studio&action=getPackageKey&sugar_body_only=true';

    private packageKeyObject = new BehaviorSubject<any[]>([]);
    public packageKey$ = this.packageKeyObject.asObservable();

    getPackageKey(moduleName: string): Observable<any[]> {
        let params = new HttpParams().set('module_label', moduleName);
        return this.http.get<any[]>(this.getPackageKeyUrl, { params }).pipe(
            tap(value => this.packageKeyObject.next(value))
        );
    }


    /*** 
     * Current Module Menu 
     * Filter Name from 
     * base-navbae 
     * 
     * ***/
    private CurrentMenuNameSource = new BehaviorSubject<any>(null);  // Holds the object
    public CurrentMenuNameobject$: Observable<any> = this.CurrentMenuNameSource.asObservable(); // Stream

    setCurrentMenuFilterName(newObject: any) {
        this.CurrentMenuNameSource.next(newObject);
    }


    /*** 
     * Menu Filters API 
     * 
     * ***/
    private readMenuFiltersUrl = 'legacy/index.php?module=Studio&action=readMenuFilters&sugar_body_only=true';

    private menuFiltersObject = new BehaviorSubject<any[]>([]);
    public menuFilters$ = this.menuFiltersObject.asObservable();

    readMenuFilters(): Observable<any[]> {
        return this.http.get<any[]>(this.readMenuFiltersUrl).pipe(
            tap(n => this.menuFiltersObject.next(n))
        );
    }

    
    /*** 
     * Notifications API 
     * 
     * ***/
    private readNotificationsUrl = 'legacy/index.php?module=Alerts&action=readNotifications&sugar_body_only=true';

    private notificationsSubject = new BehaviorSubject<any[]>([]);
    public notifications$ = this.notificationsSubject.asObservable();

    readNotifications(off_set: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.readNotificationsUrl}&offset=${off_set}`).pipe(
            tap(n => this.notificationsSubject.next(n))
        );
    }

    // readNotifications(userId: any): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.readNotificationsUrl}&userId=${userId}`).pipe(
    //         tap(n => this.notificationsSubject.next(n))
    //     );
    // }


    /*** 
     * Notes API calls
     * 
     * ***/
    private createNoteUrl = 'legacy/index.php?module=Notes&action=AddCustomNotes&sugar_body_only=true';
    private readNotesUrl = 'legacy/index.php?module=Notes&action=GetCustomNotes&sugar_body_only=true';
    private deleteNoteUrl = 'legacy/index.php?module=Notes&action=DeleteCustomNotes&sugar_body_only=true';
    
    private notesSubject = new BehaviorSubject<any[]>([]);
    public notes$ = this.notesSubject.asObservable();

    // fetch updated notes list
    readNotes(): Observable<any[]> {
        return this.http.get<any[]>(this.readNotesUrl).pipe(
            tap(notes => this.notesSubject.next(notes))
        );
    }

    // Create a note, then fetch updated notes list
    createNote(note: any): Observable<any[]> {
        return this.http.post<any>(this.createNoteUrl, note).pipe(
            switchMap(() => this.readNotes())
        );
    }

    deleteNote(noteId: any): Observable<any[]> {
        return this.http.post<any>(this.deleteNoteUrl, noteId).pipe(
            switchMap(() => this.readNotes())
        );
    }

    // createNote(note: Note): Observable<any> {
    //   return this.http.post(this.createNoteUrl, note);
    // }

    // getNotes(): Observable<any> {
    //   return this.http.get(this.readNotesUrl);
    // }


    /*** 
     * Navbar object from 
     * base-navbae to navbar-top 
     * 
     * ***/
    private objectSource = new BehaviorSubject<any>(null);  // Holds the object
    public object$: Observable<any> = this.objectSource.asObservable(); // Stream

    setObject(newObject: any) {
        this.objectSource.next(newObject);
    }

    getObject(): any {
        return this.objectSource.getValue();
    }


    /*** 
     * Recently viewed Object from 
     * base-navbar to navbar-top 
     * 
     * ***/
    private recentlyViewedObjectSource = new BehaviorSubject<any>(null);
    public recentlyViewedObject$: Observable<any> = this.recentlyViewedObjectSource.asObservable();

    setRecentlyViewedObject(newObject: any) {
        this.recentlyViewedObjectSource.next(newObject);
    }

    getRecentlyViewedObject(): any {
        return this.recentlyViewedObjectSource.getValue();
    }


    /*** 
     * Action buttons data from 
     * button-group.component to record.component 
     * 
     * ***/
    private actionButtonsObjectSource = new BehaviorSubject<any>(null);
    public actionButtonsObject$: Observable<any> = this.actionButtonsObjectSource.asObservable();

    setActionButtonsObject(newObject: any) {
        this.actionButtonsObjectSource.next(newObject);
    }

    getActionButtonsObject(): any {
        return this.actionButtonsObjectSource.getValue();
    }


    /*** 
     * Save and cancel buttons data from 
     * button-group.component to record.component 
     * 
     * ***/
    private saveCancelButtonsObjectSource = new BehaviorSubject<any>(null);
    public saveCancelButtonsObject$: Observable<any> = this.saveCancelButtonsObjectSource.asObservable();

    setSaveCancelButtonsObject(newObject: any) {
        this.saveCancelButtonsObjectSource.next(newObject);
    }


    /*** 
     * Create a BehaviorSubject 
     * to store and stream 
     * the count value 
     * 
     * ***/
    private countSubject = new BehaviorSubject<number>(0);

    // Observable that components can subscribe to
    count$ = this.countSubject.asObservable();

    // Method to update the count value
    updateCount(newCount: number): void {
        this.countSubject.next(newCount);
    }


    /*** 
     * Bulk action button 
     * data from 
     * bulk-action-menu.component 
     * to list-header.component 
     * 
     * ***/
    private bulkActionButtonsObjectSource = new BehaviorSubject<any>(null);
    public bulkActionButtonsObject$: Observable<any> = this.bulkActionButtonsObjectSource.asObservable();

    setBulkActionsObject(newObject: any) {
        this.bulkActionButtonsObjectSource.next(newObject);
    }

    getBulkActionsObject(): any {
        return this.bulkActionButtonsObjectSource.getValue();
    }


    /*** 
     * save and cancel 
     * buttons data from 
     * button-group.component 
     * to record.component
     * 
     * ***/
    private saveButtonObjectSource = new BehaviorSubject<any>(null);
    public saveButtonObject$: Observable<any> = this.saveButtonObjectSource.asObservable();

    setSaveButtonObject(newObject: any) {
        this.saveButtonObjectSource.next(newObject);
    }

}
