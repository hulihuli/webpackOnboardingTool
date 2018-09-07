import { Component, OnInit, SimpleChanges } from "@angular/core";

import {
	TriageViewSupervisor,
	TriageViewSupervisorDto
} from "../../../core/triage/triageViewSupervisor";
import { BaseComponent } from "../../common/base.component";
import { TriageService } from "../triage.service";
import { Observable } from "rxjs/Rx";
import { Subscription } from "rxjs/Subscription";
import { LineChart, MultiChartData, SingleChartData, StackedVerticalBarChart } from "../../../core/plugin/ngxChart";
import swal from "sweetalert2";
import { Constants } from "../../../core/common/constants";
import { Router, ActivatedRoute } from "@angular/router";

class TriageSupervisorState {
	constructor(
		public isLoadingCustomerId?: boolean,
		public isLoadingCustomerEnv?: boolean,
		public isLoadingEntitySpace?: boolean,
		public isLoadingEntitySpaceView?: boolean
	) {
		// this.isLoadingCustomerId = true;
		// this.isLoadingCustomerEnv = true;
		// this.isLoadingEntitySpace = true;
		// this.isLoadingEntitySpaceView = true;
	}
}

@Component({
    selector: "triage-supervisor",
	templateUrl: "./triageSupervisor.component.html",
	styleUrls: ["./triageSupervisor.component.css"]
})
export class TriageSupervisorComponent extends BaseComponent implements OnInit {
	currentCustomerId: string;
	currentCustomerEnv: string;
	currentEntitySpace: string;
	currentEntitySpaceView: string;
	segment: string;
	owner: string;

	loadingState: TriageSupervisorState;
	customerIds: Array<string>;
	customerEnvs: Array<string>;
	entitySpaces: Array<string>;
	entitySpaceViews: Array<string>;

	cumstomerDict: Map<string, Array<string>>;
	entitySpaceViewDict: Map<string, Array<string>>;

    allTriageViewSupervisors: Array<TriageViewSupervisor>;
	triageViewSupervisors: Array<TriageViewSupervisor>;
	triageViewSupervisorDto: TriageViewSupervisorDto;

	//regular timer
	timer: Observable<number>;
	timerSubscription: Subscription;
	entitySpaceViewRequestSubscription: Subscription;

	//ui
	displayType: string;
	isFetchingViewSupervisor: boolean;
	isAddingViewSupervisor: boolean;

	versionDelayLineChart: LineChart;
	commitDelayLineChart: LineChart;
	completeVersionDelayStackedVerticalBarChartResults: Array<MultiChartData>;
	purifiedVersionDelayStackedVerticalBarChartResults: Array<MultiChartData>;

	originalOwner: string;
	originalSegment: string;

	//sort
	idDesc: boolean;
	latestVersionLatencyDesc: boolean;
    latestSucceedVersionLatencyDesc: boolean;
    
    //pagination
    currentPage: number;
    numOfPages: number;
    numPerPage: number;

	query: string;

	constructor(
        private triageService: TriageService,
        private route: ActivatedRoute,
        private router: Router
    ) {
		super();
	}

	ngOnInit() {
		this.currentCustomerId = "WrapStar";
		this.currentCustomerEnv = "Prod";
		this.currentEntitySpace = "WrapStar-Full";

		this.customerIds = new Array<string>();
		this.customerEnvs = new Array<string>();
		this.entitySpaces = new Array<string>();
		this.entitySpaceViews = new Array<string>();

		this.cumstomerDict = new Map<string, Array<string>>();
		this.entitySpaceViewDict = new Map<string, Array<string>>();

        this.loadingState = new TriageSupervisorState();
        this.allTriageViewSupervisors = new Array<TriageViewSupervisor>();
		this.triageViewSupervisors = new Array<TriageViewSupervisor>();
		this.triageViewSupervisorDto = new TriageViewSupervisorDto("WrapStar", "Prod", "WrapStar-Full");

		this.timer = Observable.timer(0, 300000);

		this.isFetchingViewSupervisor = false;
        this.isAddingViewSupervisor = false;

        this.numPerPage = 15;
        this.currentPage = 1;

		this.completeVersionDelayStackedVerticalBarChartResults = new Array<MultiChartData>();
		this.purifiedVersionDelayStackedVerticalBarChartResults = new Array<MultiChartData>();

		this.loadTriageViewSupervisors();
    }

	loadViewInfo() {
		if (this.customerIds.length == 0) {
			this.loadingState = new TriageSupervisorState(true, true, true, true);
			//add customerid and customerEnv
			this.triageService.getCustomerIds().subscribe(customers => {
				customers.forEach(customer => {
					this.customerIds.push(customer.customerId);
					this.cumstomerDict.set(customer.customerId, customer.customerEnvs);
					if (customer.customerId == this.currentCustomerId) {
						this.customerEnvs = customer.customerEnvs;
					}
				});
				this.loadingState.isLoadingCustomerId = false;
				this.loadingState.isLoadingCustomerEnv = false;
			});
			//add entitySpaces and entitySpaceViews
			this.triageService
				.getEntitySpaces(this.currentCustomerId, this.currentCustomerEnv)
				.subscribe(entitySpaces => {
					entitySpaces.forEach(entitySpace => {
						this.entitySpaces.push(entitySpace.entitySpace);
						this.entitySpaceViewDict.set(
							this.currentCustomerId + this.currentCustomerEnv + entitySpace.entitySpace,
							entitySpace.entitySpaceViews
						);
						if (entitySpace.entitySpace == this.currentEntitySpace) {
							this.entitySpaceViews = entitySpace.entitySpaceViews;
							if (entitySpace.entitySpaceViews.length > 0) {
								this.currentEntitySpaceView = entitySpace.entitySpaceViews[0];
							}
						}
					});
					this.loadingState.isLoadingEntitySpace = false;
					this.loadingState.isLoadingEntitySpaceView = false;
				});
		}
	}

	changeCustomerId() {
		this.logger.info(this.currentCustomerId);
		this.customerEnvs = this.cumstomerDict.get(this.currentCustomerId);
		if (this.customerEnvs.length > 0) {
			this.currentCustomerEnv = this.customerEnvs[0];
			this.changeCustomerEnv();
		}
	}

	changeCustomerEnv() {
		this.loadingState.isLoadingEntitySpace = true;
		this.triageService.getEntitySpaces(this.currentCustomerId, this.currentCustomerEnv).subscribe(entitySpaces => {
			this.entitySpaces = entitySpaces.map(t => t.entitySpace);
			entitySpaces.forEach(entitySpace => {
				this.entitySpaceViewDict.set(
					this.currentCustomerId + this.currentCustomerEnv + entitySpace.entitySpace,
					entitySpace.entitySpaceViews
				);
			});
			if (this.entitySpaces.length > 0) {
				this.currentEntitySpace = this.entitySpaces[0];
				this.changeEntitySpace();
			}
			this.loadingState.isLoadingEntitySpace = false;
		});
	}

	changeEntitySpace() {
		this.entitySpaceViews = this.entitySpaceViewDict.get(
			this.currentCustomerId + this.currentCustomerEnv + this.currentEntitySpace
		);
		if (this.entitySpaceViews.length > 0) {
			this.currentEntitySpaceView = this.entitySpaceViews[0];
		}
	}

	loadTriageViewSupervisors() {
        this.displayType = "All";
        this.isFetchingViewSupervisor = true;    
		this.triageService
			.getTriageViewSupervisors()
			.subscribe(triageViewSupervisors => {
				this.triageViewSupervisors = new Array<TriageViewSupervisor>();
                //initialize triageviewsupervisor ti amake get/set work
                let displayType = this.route.snapshot.queryParamMap.get("displayType");
				triageViewSupervisors.forEach(t => {
                    if(!displayType){
                        if(t.latestVersionState === "Errored") {
                            this.displayType = "Errored";
                        }
                        else if(this.displayType != "Errored" && t.latestVersionState === "Triaged") {
                            this.displayType = "Triaged";
                        }
                    }
                    else{
                        this.displayType = displayType;
                    }
                    this.addTriageView(t);
                });
                this.allTriageViewSupervisors = this.triageViewSupervisors;
				this.logger.info(this.triageViewSupervisors);
				this.isFetchingViewSupervisor = false;
			},
			error => {
				this.logger.error("fetch view supervisor err:", error);
				this.isFetchingViewSupervisor = false;
			}
		);
	}

	//since some  getters are used in TriageViewSupervisor, it can't work without constructor
	addTriageView(triageViewSupervisor: TriageViewSupervisor) {
		this.triageViewSupervisors.push(
			new TriageViewSupervisor(
				triageViewSupervisor.id,
				triageViewSupervisor.triageAnalysisId,
				triageViewSupervisor.customerId,
				triageViewSupervisor.customerEnv,
				triageViewSupervisor.entitySpaceName,
				triageViewSupervisor.entitySpaceViewName,
				triageViewSupervisor.segment,
				triageViewSupervisor.currentState,
				triageViewSupervisor.originalState,
				triageViewSupervisor.latestVersion,
				triageViewSupervisor.latestVersionState,
				triageViewSupervisor.latestCompletedVersion,
				triageViewSupervisor.latestCompletedVersionState,
				triageViewSupervisor.latestSucceedTime,
				triageViewSupervisor.latestVersionLatency,
				triageViewSupervisor.latestSucceedVersionLatency,
				triageViewSupervisor.latestStandardVersion,
				triageViewSupervisor.latestJobType,
				triageViewSupervisor.deletedCount,
				triageViewSupervisor.addedCount,
				triageViewSupervisor.churnedCount,
				triageViewSupervisor.owner,
				triageViewSupervisor.tfsUrl
			)
		);
	}

	setRefreshTimer() {
		this.timerSubscription = this.timer.subscribe(t => {
			this.loadTriageViewSupervisors();
		});
	}

	filterView(triageViewSupervisor: TriageViewSupervisor) {
		//if the view match current query
		let isMatchQuery = false;
		if (
			this.query == null ||
			triageViewSupervisor.entitySpaceViewName == null ||
			triageViewSupervisor.entitySpaceViewName.toUpperCase().includes(this.query.toUpperCase())
		) {
			isMatchQuery = true;
		}
		//if the view match current display type
		let isMatchType = false;
		switch (this.displayType) {
			case "All":
				isMatchType = true;
				break;
			case "Errored":
				isMatchType = triageViewSupervisor.latestVersionState == "Errored";
				break;
			case "Triaged":
				isMatchType = triageViewSupervisor.latestVersionState == "Triaged";
				break;
			case "Standard":
				isMatchType = triageViewSupervisor.latestVersionState == "Standard";
				break;
			case "Updating":
				isMatchType =
					triageViewSupervisor.latestVersionState != "Triaged" &&
					triageViewSupervisor.latestVersionState != "Standard" &&
					triageViewSupervisor.latestVersionState != "Errored";
				break;
			case "LongToGraph":
				isMatchType = this.isMissingSla(triageViewSupervisor);
				break;
			case "MissState":
				isMatchType = triageViewSupervisor.currentState != triageViewSupervisor.originalState;
				break;
		}
		return isMatchType && isMatchQuery;
	}

    querySupervisor() {
        if(this.query == ""){
            this.triageViewSupervisors = this.allTriageViewSupervisors;
        }
        else{
            this.triageViewSupervisors = this.allTriageViewSupervisors;
            this.triageViewSupervisors = this.triageViewSupervisors.filter(
                supervisor => 
                supervisor.entitySpaceViewName.toLocaleLowerCase().indexOf(this.query.toLocaleLowerCase()) != -1 
            );
        }
    }

	addTriageViewSupervisor() {
		this.isAddingViewSupervisor = true;

		let existView = this.triageViewSupervisors.find(
			t =>
				t.customerId == this.currentCustomerId &&
				t.customerEnv == this.currentCustomerEnv &&
				t.entitySpaceName == this.currentEntitySpace &&
				t.entitySpaceViewName == this.currentEntitySpaceView
		);
		if (existView != null) {
			swal({
				title: this.currentEntitySpaceView + " is already exist !",
				type: "error",
				timer: 1300
			});
			this.isAddingViewSupervisor = false;
		} else {
			this.triageService
				.addTriageViewSupervisor(
					this.currentCustomerId,
					this.currentCustomerEnv,
					this.currentEntitySpace,
					this.currentEntitySpaceView,
					this.segment,
					this.owner
				)
				.subscribe(triageViewSupervisor => {
					this.addTriageView(triageViewSupervisor);
					this.logger.info(triageViewSupervisor);
					this.isAddingViewSupervisor = false;
					//hide the supervisor addition modal
					(<any>$("#newViewSupervisor")).modal("hide");
				});
		}
	}

	expandStatistic(triageViewSupervisor: TriageViewSupervisor) {
		triageViewSupervisor.expandStatistic = !triageViewSupervisor.expandStatistic;
		if (triageViewSupervisor.expandStatistic) {
            
            this.triageService.getTriageReportDetail(triageViewSupervisor.id, "", "").subscribe(result => {
                triageViewSupervisor.averageLatency = result.averageLatency;
                triageViewSupervisor.minLatency = result.minLatency;
                triageViewSupervisor.maxLatency = result.maxLatency;
                triageViewSupervisor.ninetyPercentLatency = result.ninetyLatency;
                triageViewSupervisor.getMissSlaBarChart(result.allVersions);
                triageViewSupervisor.getMonthlyCountLineChart(result.allVersions);
                triageViewSupervisor.getCommitDelayLineChart(result.allVersions);
                triageViewSupervisor.getVersionDelayLineChart(result.allVersions);
                triageViewSupervisor.getVersionDetailStackedVerticalBarChart(result.allVersions);
            });
			//at the same time ,only selected one can be expanded
			this.triageViewSupervisors.forEach(t => {
				if (t.id != triageViewSupervisor.id) {
					t.expandStatistic = false;
				}
			});
		}
	}

	deleteTriageViewSupervisor(id: number) {
		swal({
			title: "Are you sure to delete this view?",
			text: "You won't be able to revert this !",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, delete it !"
		}).then(result => {
			if (result.value) {
				this.triageViewSupervisors = this.triageViewSupervisors.filter(h => h.id !== id);
				this.triageService.deleteTriageViewSupervisor(id).subscribe(result => {
					if (result.id == id) {
						swal({
							title: "Deleted !",
							text: "The view has been deleted :)",
							type: "success",
							timer: 1300
						});
					}
				});
			}
		});
	}

	changeOwnerName(triageViewSupervisor: TriageViewSupervisor) {
		triageViewSupervisor.displayOwnerNameEditor = true;
		this.originalOwner = triageViewSupervisor.owner;
		this.logger.info("after dblclick name", triageViewSupervisor.owner);
	}

	changeSegmentName(triageViewSupervisor: TriageViewSupervisor) {
		triageViewSupervisor.displaySegmentNameEditor = true;
		this.originalSegment = triageViewSupervisor.segment;
		this.logger.info("after dblclick segment", triageViewSupervisor.segment);
	}

	updateOwner(triageViewSupervisor: TriageViewSupervisor) {
		if (this.originalOwner != triageViewSupervisor.owner) {
			swal({
				title: "Are you sure to change the owner of this view?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, continue !"
			}).then(result => {
				if (result.value) {
					triageViewSupervisor.displayOwnerNameEditor = false;
					this.logger.info("after blur name", triageViewSupervisor.owner);
					this.triageService.updateTriageViewSupervisor(triageViewSupervisor).subscribe(result => {
						if (result.id == triageViewSupervisor.id) {
							swal({
								title: "Save Success !",
								text: "The change has been saved :)",
								type: "success",
								timer: 1300
							});
							this.logger.info("after change name", triageViewSupervisor.owner);
						}
					});
				}
			});
		} else {
			triageViewSupervisor.displayOwnerNameEditor = false;
		}
	}

	updateSegment(triageViewSupervisor: TriageViewSupervisor) {
		if (this.originalSegment != triageViewSupervisor.segment) {
			swal({
				title: "Are you sure to change the segment of this view?",
				type: "warning",
				showCancelButton: true,
				confirmButtonColor: "#3085d6",
				cancelButtonColor: "#d33",
				confirmButtonText: "Yes, continue !"
			}).then(result => {
				if (result.value) {
					triageViewSupervisor.displaySegmentNameEditor = false;
					this.logger.info("after blur segment", triageViewSupervisor.segment);
					this.triageService.updateTriageViewSupervisor(triageViewSupervisor).subscribe(result => {
						if (result.id == triageViewSupervisor.id) {
							swal({
								title: "Save Success !",
								text: "The change has been saved :)",
								type: "success",
								timer: 1300
							});
							this.logger.info("after change segment", triageViewSupervisor.segment);
						}
					});
				}
			});
		} else {
			triageViewSupervisor.displaySegmentNameEditor = false;
		}
	}

	sortTriageViews(column: string) {
		switch (column) {
			case "Id":
				this.idDesc = !this.idDesc;
				let idDescNum = this.idDesc ? 1 : -1;
				this.triageViewSupervisors.sort((a, b) => idDescNum * (b.id - a.id));
				break;
			case "LatestVersionLatency":
				this.latestVersionLatencyDesc = !this.latestVersionLatencyDesc;
				let latestVersionLatencyDescNum = this.latestVersionLatencyDesc ? 1 : -1;
				this.triageViewSupervisors.sort(
					(a, b) => latestVersionLatencyDescNum * (b.latestVersionLatency - a.latestVersionLatency)
				);
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

	isMissingSla(triageViewSupervisor: TriageViewSupervisor) {
		if (
			(triageViewSupervisor.originalState == "EveryVersion" &&
				triageViewSupervisor.latestSucceedVersionLatency > Constants.everyVersionLimit) ||
			(triageViewSupervisor.originalState == "MajorVersion" &&
				triageViewSupervisor.latestSucceedVersionLatency > Constants.majorVersionLimit) ||
			(triageViewSupervisor.originalState == "Manual" &&
				triageViewSupervisor.latestSucceedVersionLatency > Constants.manualLimit)
		) {
			return true;
		}
		return false;
    }
    
    addRouterQueryParams() {
        this.currentPage = 1;
        
        this.router.navigate(["/triage/supervisor"], {
            queryParams: {
                "displayType": this.displayType
            }
        });
    }

    setPage(triageViewSupervisors: Array<TriageViewSupervisor>) {
        this.numOfPages = Math.ceil(triageViewSupervisors.length / this.numPerPage);
        return triageViewSupervisors.slice( (this.currentPage - 1) * this.numPerPage, this.numPerPage * this.currentPage );
    }
}
