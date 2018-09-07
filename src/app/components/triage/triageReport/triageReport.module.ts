import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '../../../../../node_modules/@angular/common';
import { TriageReportComponent } from './triageReport.component';
import { FormsModule } from '../../../../../node_modules/@angular/forms';
import { NgxMyDatePickerModule } from '../../../../../node_modules/ngx-mydatepicker';
import { NgxChartsModule } from '../../../../../node_modules/@swimlane/ngx-charts';
import { ReportViewsDetailModal } from '../../../templates/reportViewsDetailModal/reportViewsDetailModal.module';

// routes
export const ROUTES: Routes = [
    { path: '', component: TriageReportComponent }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NgxChartsModule,
        NgxMyDatePickerModule.forRoot(),
        ReportViewsDetailModal,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        TriageReportComponent
    ]
})
export class TriageReportModule { }