import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxJsonViewerComponent } from './ngxJsonViewer.component';


@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NgxJsonViewerComponent
    ],
    exports: [
        NgxJsonViewerComponent
    ]
})
export class NgxJsonViewerModule { }
