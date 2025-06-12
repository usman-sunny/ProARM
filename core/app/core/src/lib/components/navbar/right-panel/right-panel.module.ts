import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { RightPanelComponent } from './right-panel.component';

import { AngularSvgIconModule } from 'angular-svg-icon';
import { ImageModule } from '../../image/image.module';


@NgModule({
  declarations: [ 
    //RightPanelComponent 
  ],
  imports: [
    CommonModule,
    AngularSvgIconModule,
    ImageModule
  ],
  exports: [ 
    //RightPanelComponent
  ]
})
export class RightPanelModule { }
