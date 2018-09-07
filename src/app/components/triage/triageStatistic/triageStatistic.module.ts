import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '../../../../../node_modules/@angular/common';
import { TriageStatisticComponent } from './triageStatistic.component';
import { NgxChartsModule } from '../../../../../node_modules/@swimlane/ngx-charts';
import { NgxAlertsModule } from '../../../../../node_modules/@ngx-plus/ngx-alerts';

// routes
export const ROUTES: Routes = [
    { path: '', component: TriageStatisticComponent }
];

@NgModule({
    imports: [
        CommonModule,
        NgxChartsModule,
        RouterModule.forChild(ROUTES)
    ],
    declarations: [
        TriageStatisticComponent
    ]
})
export class TriageStatisticModule { }