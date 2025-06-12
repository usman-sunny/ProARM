import { Component, OnInit, EventEmitter, Output  } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { StupidDataService } from '../../../services/stupid-data/stupid-data.service';

@Component({
  selector: 'scrm-navbar-top',
  templateUrl: './navbar-top.component.html',
  styleUrls: []
})
export class NavbarTopComponent implements OnInit {

  isUserLoggedIn: boolean = false;

  @Output() togglePanel = new EventEmitter<string>();
  
  navbar: any;
  recentlyViewed: any;
  
  constructor(
    private authService: AuthService,
    private stupidData: StupidDataService
  ) {}

  ngOnInit() {
    this.authService.isUserLoggedIn.subscribe(status => {
      this.isUserLoggedIn = status;
    });

    // nabvar object from base navbar component through stupid data service
    this.stupidData.object$.subscribe(navbar => {
      if (navbar) {
        this.navbar = navbar;
        //console.log('Navbar from stupid service:', navbar);
      }
    });

    // recentlyviewed object from base navbar component through stupid data service
    this.stupidData.recentlyViewedObject$.subscribe(rc_viewd => {
        this.recentlyViewed = rc_viewd;
        //console.log('rc_viewed from stupid service:', rc_viewd);
    });

  }
  
  toggleRightPanel(name: string) {
    this.togglePanel.emit(name);
  }
}