import { TemplateRef } from "@angular/core";

export class BaseChart {
	constructor(
		public view?: Array<number>,
		//public results?: Array<PieChartData>,
		public scheme?: ColorScheme,
		public customColors?: Array<string>,
		public animations?: boolean,
		public gradient?: boolean,
		public tooltipDisabled?: boolean,
		public tooltipTemplate?: TemplateRef<string>,
		public activeEntries?: Array<object>
	) {
        this.view = [700, 400];
		this.gradient = false;
		//this.results = new Array<PieChartData>();
		this.scheme = new ColorScheme();
		this.customColors = new Array<string>();
		this.activeEntries = new Array<object>();
	}
}

// see details here: https://swimlane.gitbooks.io/ngx-charts/content/charts/advanced-pie-chart.html
export class AdvancedPieChart extends BaseChart {
	constructor(
		public label?: string,
        public results?: Array<SingleChartData>,
        public pieChartDetailLayerValueDict?:Map<string, object>//help to display the values of low/middle/high range
	) {
		super();
        this.results = new Array<SingleChartData>();
        this.pieChartDetailLayerValueDict = new Map<string, object>();
	}
}

export class PieGridChart extends BaseChart {
	constructor(
		public label?: string,
        public results?: Array<SingleChartData>,
        public pieGridChartDetailDict?:Map<string, object>,
        public pieGridChartDetailLayerValueDict?:Map<string, object>
	) {
		super();
        this.results = new Array<SingleChartData>();
        this.pieGridChartDetailDict = new Map<string, object>();
        this.pieGridChartDetailLayerValueDict = new Map<string, object>();
	}
}

export class SingleChartData {
	constructor(public name?: string, public value?: number) {}
}

export class MultiChartData {
	constructor(public name?: string, public series?: Array<SingleChartData>) {
        if(series){
            this.series = series;
        }
        else{
            this.series = new Array<SingleChartData>();
        }
	}
}

export class ColorScheme {
	constructor(public domain?: Array<string>) {
		this.domain = new Array<string>();
	}
}

export class BarChart extends BaseChart {
	constructor(
		public schemeType?: string,
		public legend?: boolean,
		public legendTitle?: string,
		public xAxis?: boolean,
		public yAxis?: boolean,
		public showGridLines?: boolean,
		public roundDomains?: boolean,
		public showXAxisLabel?: boolean,
		public showYAxisLabel?: boolean,
		public xAxisLabel?: string,
        public yAxisLabel?: string,
        public tooltipTemplate?: TemplateRef<any>,
		public xAxisTickFormatting?: Function,
		public yAxisTickFormatting?: Function,
		public barPadding?: number,
		public yScaleMax?: number
	) {
		super();
		this.xAxis = true;
		this.yAxis = true;
		this.gradient = false;
		this.legend = true;
		this.showYAxisLabel = true;
		this.showXAxisLabel = true;
	}
}

export class VerticalBarChart extends BarChart {
	constructor(
        public results?: Array<SingleChartData>,
        public verticalBarChartDict?: Map<string, object>
    ) {
		super();
		this.xAxisLabel = "Day";
		this.yAxisLabel = "Count";
        this.results = new Array<SingleChartData>();
        this.verticalBarChartDict = new Map<string, object>();
		//this.results =
	}
}

export class GroupedVerticalBarChart extends BarChart {
    constructor(
        public results?: Array<MultiChartData>,
        public groupPadding?: number,
        public groupedVerticalBarChartDetailDict?: Map<string, object>
    ) {
		super();
		this.results = new Array<MultiChartData>();
		this.xAxisLabel = "Day";
		this.yAxisLabel = "Count";
		this.groupedVerticalBarChartDetailDict = new Map<string, object>();
	}
}

export class StackedVerticalBarChart extends BarChart {
    constructor(
        public results?: Array<MultiChartData>,
        public stackedVerticalBarChartDetailDict?: Map<string, any>
    ) {
		super();
		this.results = new Array<MultiChartData>();
		this.stackedVerticalBarChartDetailDict = new Map<string, any>();
	}
}

export class BaseLineChart extends BaseChart {
	constructor(
		public schemeType?: string,
		public legend?: boolean,
		public legendTitle?: string,
		public xAxis?: boolean,
		public yAxis?: boolean,
		public showGridLines?: boolean,
		public roundDomains?: boolean,
		public showXAxisLabel?: boolean,
		public showYAxisLabel?: boolean,
		public xAxisLabel?: string,
		public yAxisLabel?: string,
		public xAxisTickFormatting?: Function,
		public yAxisTickFormatting?: Function,
		public seriesTooltipTemplate?: TemplateRef<any>,
		public xScaleMin?: any,
		public xScaleMax?: any,
		public yScaleMin?: number,
		public yScaleMax?: number,
		public rangeFillOpacity?: number,
		public timeline?: boolean,
		public autoScale?: boolean,
		public curve?: Function
	) {
		super();
		this.xAxis = true;
		this.yAxis = true;
		this.gradient = false;
		this.legend = true;
		this.showYAxisLabel = true;
		this.showXAxisLabel = true;
	}
}

export class LineChart extends BaseLineChart {
	constructor(
		public results?: Array<MultiChartData>,
		public referenceLines?: Array<object>,
		public showRefLines?: boolean,
        public showRefLabels?: boolean,
        public lineChartDetailDict?: Map<string, object>
	) {
		super();
        this.results = new Array();
        this.lineChartDetailDict = new Map<string, object>();
	}
}

export class NumberCardChart extends BaseChart{
    constructor(
        public results?:Array<SingleChartData>,
        public cardColor?:string,//format: 'rgba(0, 0, 0, 0)'
        public bandColor?:string,
        public textColor?:string,
        public emptyColor?:string,
        public innerPadding?:number
    ){
        super();
        this.results = new Array();
    }
}