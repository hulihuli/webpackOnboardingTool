import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TriageSupervisorComponent } from './triageSupervisor.component';
import { CommonModule } from '../../../../../node_modules/@angular/common';
import { TablePaginationComponent } from '../../../templates/tablePagination/tablePagination.component';
import { FormsModule } from '../../../../../node_modules/@angular/forms';
import { DisplayTypeFilterPipe } from '../../../pipe/displayTypeFilterPipe';
import { ViewStatisticPanelModule } from '../../../templates/viewStatisticPanel/viewStatisticPanel.module';

// routes
export const ROUTES: Routes = [
  { path: '', component: TriageSupervisorComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ViewStatisticPanelModule,
    RouterModule.forChild(ROUTES)
  ],
  declarations: [
    TriageSupervisorComponent,
    TablePaginationComponent,
    DisplayTypeFilterPipe
  ]
})
export class TriageSupervisorModule {}