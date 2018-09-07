import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';//ngModel
import { HttpModule } from '@angular/http';
//routes
import { ReportRoutingModule } from './report-routing.module';
import { ContributionComponent } from './contribution/contribution.component';
import { ReportComponent } from './report.component';
import { CommonModule } from '../../../../node_modules/@angular/common';

//plugin
//import {SlimLoadingBarModule} from 'ng2-slim-loading-bar'


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    ReportRoutingModule,
    //SlimLoadingBarModule.forRoot()
  ],
  declarations: [
    ContributionComponent,
    ReportComponent
  ],
  providers: [
    
  ]
})

export class ReportModule { }
