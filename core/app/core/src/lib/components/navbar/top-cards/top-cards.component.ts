import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { AppStateStore, AppState } from '../../../store/app-state/app-state.store';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';

@Component({
  selector: 'scrm-top-cards',
  templateUrl: './top-cards.component.html',
  styleUrls: [] 
})
export class TopCardsComponent implements OnInit {
  
  isUserLoggedIn: boolean = false;
  currentModule: string;
  receivedObject: any;

  constructor(
    private authService: AuthService,
    private appStateStore: AppStateStore,
    private stupidData: StupidDataService
  ) {}

  ngOnInit() {
    
    this.authService.isUserLoggedIn.subscribe(status => {
      this.isUserLoggedIn = status;
    });

    // Gets current module name
    this.appStateStore.module$.subscribe(module => {
      //console.log('Module:', module);
      this.currentModule = module;
    });


    // this.stupidData.object$.subscribe((obj) => {
    //   if (obj) {
    //     console.log('Received object:', obj);
    //     this.receivedObject = obj;
    //   }
    // });

  }
}
