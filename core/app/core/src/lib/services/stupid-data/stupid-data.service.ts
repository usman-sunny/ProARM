import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';

export interface Note {
  title: string | null;
  description: string | null;
  label: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class StupidDataService {

    private createNoteUrl = 'legacy/index.php?module=Notes&action=AddCustomNotes&sugar_body_only=true';
    private readNotesUrl = 'legacy/index.php?module=Notes&action=GetCustomNotes&sugar_body_only=true';
    private deleteNoteUrl = 'legacy/index.php?module=Notes&action=DeleteCustomNotes&sugar_body_only=true';
    
    private notesSubject = new BehaviorSubject<any[]>([]);
    public notes$ = this.notesSubject.asObservable();
    
    constructor(private http: HttpClient) {}

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
    // ===========================================================================================

    // navbar object from base-navbae to navbar-top - start
    private objectSource = new BehaviorSubject<any>(null);  // Holds the object
    public object$: Observable<any> = this.objectSource.asObservable(); // Stream

    setObject(newObject: any) {
        this.objectSource.next(newObject);
    }

    getObject(): any {
        return this.objectSource.getValue();
    }
    // navbar object from base-navbae to navbar-top - end
    // ===========================================================================================

    // recently viewed Object from base-navbar to navbar-top - start
    private recentlyViewedObjectSource = new BehaviorSubject<any>(null);
    public recentlyViewedObject$: Observable<any> = this.recentlyViewedObjectSource.asObservable();

    setRecentlyViewedObject(newObject: any) {
        this.recentlyViewedObjectSource.next(newObject);
    }

    getRecentlyViewedObject(): any {
        return this.recentlyViewedObjectSource.getValue();
    }
    // recently viewed Object from base-navbar to navbar-top - end
    // ===========================================================================================

    // insights Object from list-header to list-container - start
    private insightsObjectSource = new BehaviorSubject<any>(null);
    public insightsObject$: Observable<any> = this.insightsObjectSource.asObservable();

    setInsightsObject(newObject: any) {
        this.insightsObjectSource.next(newObject);
    }

    getInsightsObject(): any {
        return this.insightsObjectSource.getValue();
    }
    // insights Object from list-header to list-container - end
    // ===========================================================================================

    // action buttons data from button-group.component to record.component - start
    private actionButtonsObjectSource = new BehaviorSubject<any>(null);
    public actionButtonsObject$: Observable<any> = this.actionButtonsObjectSource.asObservable();

    setActionButtonsObject(newObject: any) {
        this.actionButtonsObjectSource.next(newObject);
    }

    getActionButtonsObject(): any {
        return this.actionButtonsObjectSource.getValue();
    }
    // action buttons data from button-group.component to record.component - end
    // ===========================================================================================

    // save and cancel buttons data from button-group.component to record.component - start
    private saveCancelButtonsObjectSource = new BehaviorSubject<any>(null);
    public saveCancelButtonsObject$: Observable<any> = this.saveCancelButtonsObjectSource.asObservable();

    setSaveCancelButtonsObject(newObject: any) {
        this.saveCancelButtonsObjectSource.next(newObject);
    }
    // save and cancel buttons data from button-group.component to record.component - end
    // ===========================================================================================

    // Create a BehaviorSubject to store and stream the count value - start
    private countSubject = new BehaviorSubject<number>(0);

    // Observable that components can subscribe to
    count$ = this.countSubject.asObservable();

    // Method to update the count value
    updateCount(newCount: number): void {
        this.countSubject.next(newCount);
    }
    // Create a BehaviorSubject to store and stream the count value - end
    // ===========================================================================================

    // bulk action button data from bulk-action-menu.component to list-header.component - start
    private bulkActionButtonsObjectSource = new BehaviorSubject<any>(null);
    public bulkActionButtonsObject$: Observable<any> = this.bulkActionButtonsObjectSource.asObservable();

    setBulkActionsObject(newObject: any) {
        this.bulkActionButtonsObjectSource.next(newObject);
    }

    getBulkActionsObject(): any {
        return this.bulkActionButtonsObjectSource.getValue();
    }
    // bulk action button data from bulk-action-menu.component to list-header.component - end
    // ===========================================================================================


    // save and cancel buttons data from button-group.component to record.component - start
    private saveButtonObjectSource = new BehaviorSubject<any>(null);
    public saveButtonObject$: Observable<any> = this.saveButtonObjectSource.asObservable();

    setSaveButtonObject(newObject: any) {
        this.saveButtonObjectSource.next(newObject);
    }
    // save and cancel buttons data from button-group.component to record.component - end
    // ===========================================================================================
  
}
