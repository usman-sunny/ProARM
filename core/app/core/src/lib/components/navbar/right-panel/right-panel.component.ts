import { Component, OnInit, OnDestroy } from '@angular/core';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';
import { AuthService } from '../../../services/auth/auth.service';
import { DatePipe } from '@angular/common';
//import { offset } from '@popperjs/core';

@Component({
    selector: 'right-panel',
    templateUrl: './right-panel.component.html',
    styleUrls: [],
    providers: [DatePipe]
})
export class RightPanelComponent implements OnInit, OnDestroy {
    
    isVisible: boolean = false;
    isUserLoggedIn: boolean;

    $name: string = "";
    id: any;
    title: any;
    description: any;
    openNotesModal: boolean = false;
    isLabelMissing: boolean = false;
    isReadonly: boolean = false;
    navbar: any = null;
    off_set: number = 0;
    
    labels: string[] = [
        'Personal',
        'Farming',
        'Management',
        'Finance',
        'Marketing',
        'Sales',
    ];
    selected_labels: string[] = [];
    notes: any = {};

    displayNotes$ = this.stupidService.notes$;
    displayNotifications$ = this.stupidService.notifications$;

    constructor(
        private stupidService: StupidDataService,
        protected authService: AuthService,
        private datePipe: DatePipe
    ) {
    }


    ngOnInit(): void {

        this.stupidService.object$.subscribe(value => {
            this.navbar = value;
        });
        
        // this.stupidService.object$.pipe(
        //     filter(v => !!v?.currentUser?.id),
        //     tap(v => {
        //         this.navbar = v;
        //         console.log('User ID from filtered stream:', v.currentUser.id);
        //     }),
        //     switchMap(v => this.stupidService.readNotifications(v.currentUser.id))
        // ).subscribe();

        // setTimeout(() => {
        //     this.stupidService.readNotifications(this.navbar?.currentUser?.id).subscribe(value => {
        //         console.log('Notifications from right-panel - api call response:', value);
        //     });
        // }, 1000);

        // this.stupidService.readNotifications().subscribe(value => {
        //     console.log('Notifications from right-panel - api call response:', value);
        // });

        this.readNotifications();

        console.log('navbar from right-panel:', this.navbar);
        

        this.stupidService.readNotes().subscribe();

        this.authService.isUserLoggedIn.subscribe(value => {
            this.isUserLoggedIn = value;
        });

        this.stupidService.notes$.subscribe(value => {
            //console.log('subscription value from notes$ :', value);
        });
    }


    ngOnDestroy(): void {
        this.authService.isUserLoggedIn.unsubscribe();
    }

    
    formatDate(inputDate: any, dateFormat: any): any {
        return this.datePipe.transform(inputDate, dateFormat) || '';
    }

    createNote(): void {

        if (this.selected_labels.length > 0) {
            this.notes = {
                ID: this.id ?? null,
                title: this.title ?? null,
                description: this.description ?? null,
                labels: this.selected_labels ?? []
            };
    
            this.stupidService.createNote(this.notes).subscribe();
            this.closeModal();
        } else {
            this.isLabelMissing = true;
        }
    }

    deleteNote(id: any): void {
        const deleteID = {
            ID: id ?? null,
        };

        this.stupidService.deleteNote(deleteID).subscribe();
    }

    editNote(item: any, isReadonly: any = false): void {
        this.id = item.id;
        this.title = item.name;
        this.description = item.description;
        //this.selected_labels = item.label_c;
        this.selected_labels = [...item.label_c];

        if (isReadonly) {
            this.isReadonly = true;
        }

        this.openNotesModal = true;
    }

    resetNote(): void {
        this.id = null;
        this.title = null;
        this.description = null;
        this.selected_labels = [];
        this.isLabelMissing = false;
        this.isReadonly = false;
    }

    readNotifications(): void {
        this.off_set += 1;
        this.stupidService.readNotifications(this.off_set).subscribe(value => {
            console.log('Notifications from right-panel - api call response:', value);
        });
    }

    openModal(): void {
        this.openNotesModal = true;
    }

    closeModal(): void {
        this.openNotesModal = false;
        this.resetNote();
    }

    addLabel(label: string): void {
        this.selected_labels.push(label);
    }

    removeLabel(label: string, index: number): void {
        if (this.selected_labels[index] === label) {
            this.selected_labels.splice(index, 1);
        }
    }


    togglePanel(rname: string) {
        this.$name = rname;
        this.isVisible = true;
    }

    closePanel() {
        this.isVisible = false;
    }
    
}
