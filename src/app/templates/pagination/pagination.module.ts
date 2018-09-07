import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { PaginationComponent } from "./pagination.component";
import { SafePipe } from "../../pipe/safeUrlPipe";
import { CommonModule } from "../../../../node_modules/@angular/common";

@NgModule({
	imports: [
        CommonModule, 
        FormsModule,
        NgxChartsModule,
    ],
    exports: [
        PaginationComponent
    ],
	declarations: [
        PaginationComponent
    ]
})

export class PaginationModule {}