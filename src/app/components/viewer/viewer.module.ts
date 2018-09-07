import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ViewerRoutingModule } from "./viewer-routing.module";
import { ViewerComponent } from "./viewer.component";
import { EntityDiffViewerComponent } from "./entityDiffViewer/entityDiffViewer.component";

import { ViewerService } from "./viewer.service";
import { PayloadDiffViewerComponent } from "./payloadDiffViewer/payloadDiffViewer.component";
import { DiffViewerTableModule } from "../../templates/diffViewerTable/diffViewerTable.module";
import { PayLoadDiffViewerTableModule } from "../../templates/payloadDiffViewTable/payloadDiffViewTable.module";
import { CommonModule } from "../../../../node_modules/@angular/common";


@NgModule({
    imports: [
      CommonModule,
      FormsModule,
      HttpClientModule,
      ViewerRoutingModule,
      DiffViewerTableModule,
      PayLoadDiffViewerTableModule
    ],
    declarations: [
      ViewerComponent,
      EntityDiffViewerComponent,
      PayloadDiffViewerComponent
    ],
    providers: [
      ViewerService
    ]
  })
  
  export class ViewerModule { }