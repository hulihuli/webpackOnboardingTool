import { Component, OnInit, Input } from "@angular/core";
import { BaseComponent } from "../../components/common/base.component";
import { TriageViewSupervisor } from "../../core/triage/triageViewSupervisor";
import { TriageService } from "../../components/triage/triage.service";
import { StackedVerticalBarChart } from "../../core/plugin/ngxChart";
import { TriageReport, TriageReportDetail } from "../../core/triage/triageReport";
import { ViewVersionLatency } from "../../core/triage/triageStatistic";

@Component({
    selector: "report-detail-modal",
    templateUrl: "./reportViewsDetailModal.component.html",
    styles: []
})
export class ReportViewsDetailModalComponent extends BaseComponent implements OnInit {
    @Input() triageViewSupervisors: Array<TriageViewSupervisor>;
    @Input() triageReport: TriageReport;
    @Input() startDate: string;
    @Input() endDate: string;

    //sort
    IdDesc: boolean;
    viewNameDesc: boolean;
    missSlaDesc: boolean;
    triageTimesDesc: boolean;
    updatesDesc: boolean;
    latestVersionLatencyDesc: boolean;
    latestSucceedVersionLatencyDesc: boolean;
    constructor(private triageService: TriageService) {
        super();
    }

    ngOnInit() { }

    expandViewDetail(triageViewSupervisor: TriageViewSupervisor) {
        triageViewSupervisor.expandStatistic = !triageViewSupervisor.expandStatistic;
        if (triageViewSupervisor.expandStatistic) {
            if (
                triageViewSupervisor.versionDetailStackedVerticalBarChart == null ||
                triageViewSupervisor.versionDetailStackedVerticalBarChart.results.length == 0
            ) {
                triageViewSupervisor.versionDetailStackedVerticalBarChart = new StackedVerticalBarChart(); //can't...of undefined

                let allversions = new Array<ViewVersionLatency>();
                if (triageViewSupervisor.allVersions && triageViewSupervisor.allVersions.length != 0) {
                    allversions = triageViewSupervisor.allVersions;
                }
                else{
                    this.triageService
                    .getViewVersionLatency(triageViewSupervisor.id, this.startDate, this.endDate)
                    .subscribe(result => {
                        allversions = result;
                    })
                }
                triageViewSupervisor.getMissSlaBarChart(allversions);
                triageViewSupervisor.getMonthlyCountLineChart(allversions);
                triageViewSupervisor.getCommitDelayLineChart(allversions);
                triageViewSupervisor.getVersionDelayLineChart(allversions);
                triageViewSupervisor.getVersionDetailStackedVerticalBarChart(allversions);
            }
        }

    }

    sortViewDetails(column: string) {
        switch (column) {
            case "Id":
                this.IdDesc = !this.IdDesc;
                let IdDescNum = this.IdDesc ? 1 : -1;
                this.triageViewSupervisors.sort(
                    (a, b) => IdDescNum * (b.id > a.id ? 1 : -1)
                );
                break;
            case "ViewName":
                this.viewNameDesc = !this.viewNameDesc;
                let viewNameDescNum = this.viewNameDesc ? 1 : -1;
                this.triageViewSupervisors.sort(
                    (a, b) => viewNameDescNum * (b.entitySpaceViewName > a.entitySpaceViewName ? 1 : -1)
                );
                break;
            case "MissSla":
                this.missSlaDesc = !this.missSlaDesc;
                let missSlaDescNum = this.missSlaDesc ? 1 : -1;
                this.triageViewSupervisors.sort((a, b) => missSlaDescNum * (b.missSla - a.missSla));
                break;
            case "Updates":
                this.updatesDesc = !this.updatesDesc;
                let updatesDescNum = this.updatesDesc ? 1 : -1;
                this.triageViewSupervisors.sort((a, b) => updatesDescNum * (b.updates - a.updates));
                break;
            case "TriageTimes":
                this.triageTimesDesc = !this.triageTimesDesc;
                let triageTimesDescNum = this.triageTimesDesc ? 1 : -1;
                this.triageViewSupervisors.sort((a, b) => triageTimesDescNum * (b.triageTimes - a.triageTimes));
                break;
            case "LatestVersionLatency":
                this.latestVersionLatencyDesc = !this.latestVersionLatencyDesc;
                let latestVersionLatencyDescNum = this.latestVersionLatencyDesc ? 1 : -1;
                this.triageViewSupervisors.sort( (a, b) => latestVersionLatencyDescNum * (b.latestVersionLatency - a.latestVersionLatency));
                break;
			case "LatestSucceedVersionLatency":
				this.latestSucceedVersionLatencyDesc = !this.latestSucceedVersionLatencyDesc;
				let latestSucceedVersionLatencyDescNum = this.latestSucceedVersionLatencyDesc ? 1 : -1;
				this.triageViewSupervisors.sort((a, b) => {
					if (b.latestSucceedVersionLatency == a.latestSucceedVersionLatency) {
						return latestSucceedVersionLatencyDescNum * (b.latestVersionLatency - a.latestVersionLatency);
					}
					return (
						latestSucceedVersionLatencyDescNum *
						(b.latestSucceedVersionLatency - a.latestSucceedVersionLatency)
					);
				});
				break;
        }
    }
}
