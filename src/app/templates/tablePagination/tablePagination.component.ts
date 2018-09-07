import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from "@angular/core";
import { TriageViewSupervisor } from "../../core/triage/triageViewSupervisor";

@Component({
	selector: "table-pagination",
	templateUrl: "./tablePagination.component.html"
})
export class TablePaginationComponent implements OnInit {
	private _numOfPages = 0;
	public pages: Array<number>;

	@Input()
	numPerPage: number = 15;
	@Input()
	currentPage: number = 1;
	@Output()
	currentPageChange = new EventEmitter<number>();
	//https://stackoverflow.com/questions/38571812/how-to-detect-when-an-input-value-changes-in-angular
	//https://scotch.io/tutorials/3-ways-to-pass-async-data-to-angular-2-child-components
	@Input()
	set numOfPages(numOfPages: number) {
		this._numOfPages = numOfPages;
		this.pages = [];
		for (var i = 1; i <= numOfPages; i++) {
			this.pages.push(i);
		}
	}
	get numOfPages() {
		return this._numOfPages;
	}

	constructor() {}

	ngOnInit() {}

	isFirst() {
		return this.currentPage === 1;
	}

	isLast() {
		return this.currentPage === this.numOfPages;
	}

	isActive(page: number) {
		return this.currentPage === page;
	}

	selectPage(page: number) {
		if (page != 0) {
			if (!this.isActive(page)) {
				this.currentPage = page;
				this.currentPageChange.emit(this.currentPage);
			}
		}
	}

	goPrevious() {
		if (!this.isFirst()) {
			this.selectPage(this.currentPage - 1);
		}
	}

	goNext() {
		if (!this.isLast()) {
			this.selectPage(this.currentPage + 1);
		}
	}
}
