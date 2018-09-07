import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '../../../../../node_modules/@angular/common';
import { TriageAnalysisComponent } from './triageAnalysis.component';
import { FormsModule } from '../../../../../node_modules/@angular/forms';
import { JobPanelModule } from '../../../templates/jobPanel/jobPanel.module';
import { TriageAnalysisResultModule } from '../../../templates/triageAnalysisResult/triageAnalysisResult.module';
import { NgxAlertsModule } from '../../../../../node_modules/@ngx-plus/ngx-alerts';

// routes
export const ROUTES: Routes = [
  { path: '', component: TriageAnalysisComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    JobPanelModule,
    TriageAnalysisResultModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    TriageAnalysisComponent
  ]
})
export class TriageAnalysisModule {}