import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

//routes
import { TriageRoutingModule } from './triage-routing.module';

//component
import { TriageComponent } from './triage.component';

//service
import { TriageService } from './triage.service';

//plugin
//import {SlimLoadingBarModule} from 'ng2-slim-loading-bar'
import { NgxAlertsModule } from '@ngx-plus/ngx-alerts';
import { UiSwitchModule } from 'ngx-ui-switch';
import { DiffViewerTableModule } from '../../templates/diffViewerTable/diffViewerTable.module';
import { CommonModule } from '../../../../node_modules/@angular/common';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    UiSwitchModule,
    NgxAlertsModule.forRoot(),
    DiffViewerTableModule,
    TriageRoutingModule,
    //SlimLoadingBarModule.forRoot()
  ],
  declarations: [
    TriageComponent
  ],
  providers: [
    TriageService
  ]
})

export class TriageModule { }
