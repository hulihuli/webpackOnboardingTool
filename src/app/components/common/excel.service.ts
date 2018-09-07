import { Injectable } from "@angular/core";
import * as XLSX from "xlsx";

@Injectable()
export class ExcelService {
	constructor() {}

	exportAsExcel(excelName: string, exportData: any[][], isGenerating: boolean) {
		isGenerating = true;

	    /* generate worksheet */
		const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(exportData);

		/* generate workbook and add the worksheet */
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

		/* save to file */
		XLSX.writeFile(wb, `${excelName}.xlsx`);
		isGenerating = false;
	}
}
