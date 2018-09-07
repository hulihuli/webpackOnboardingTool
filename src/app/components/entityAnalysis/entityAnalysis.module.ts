import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';//ngModel
import { HttpModule } from '@angular/http';
//routes
import { EntityAnalysisRoutingModule } from './entityAnalysis-routing.module';

//plugin
//import {SlimLoadingBarModule} from 'ng2-slim-loading-bar'

import { AnalysisNavComponent }  from './common/analysisNav.component';
import { AnalysisDashboardComponent } from './dashboard/analysisDashboard.component'
import { EntityAnalysisComponent } from './entityAnalysis.component'
// import { EntitySpaceAnalysisComponent } from './entitySpace/entitySpaceAnalysis.component';
import { PayloadExplorerComponent } from './entitySpace/payloadExplorer.component';
import { PayloadStatisticComponent } from './entitySpace/payloadStatistic.component';
import { PayloadFilterComponent } from './entitySpace/payloadFilter.component';
import { EntityViewAnalysisComponent }  from './entityView/entityViewAnalysis.component';
import { EntityGraphAnalysisComponent }  from './entityGraph/entityGraphAnalysis.component';

import { AnalysisDashboardService } from './service/analysisDashboard.service'
import { CommonModule } from '../../../../node_modules/@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpModule,
    EntityAnalysisRoutingModule,
    //SlimLoadingBarModule.forRoot()
  ],
  declarations: [
    AnalysisDashboardComponent,
    EntityAnalysisComponent,
    AnalysisNavComponent,
    //EntitySpaceAnalysisComponent,
    EntityViewAnalysisComponent,
    EntityGraphAnalysisComponent,
    PayloadExplorerComponent,
    PayloadStatisticComponent,
    PayloadFilterComponent
  ],
  providers: [
    AnalysisDashboardService
  ]
})

export class EntityAnalysisModule { }
