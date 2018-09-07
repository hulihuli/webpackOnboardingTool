import { Injectable } from "@angular/core";
import {
    HttpClient,
    HttpEvent,
    HttpInterceptor,
    HttpHandler,
    HttpRequest,
    HttpParams,
    HttpHeaders,
    HttpResponse
} from "@angular/common/http";
//import "rxjs/add/operator/toPromise";

import { EntityView } from "../../core/common/entityView";
import { BaseService } from "../common/base.service";
import { ApiController, RequestAction, ReportType } from "../../core/enums";
import { TriageAnalysisDto, Revision } from "../../core/triage/triageAnalysis";
import { TriageAnalysis } from "../../core/triage/triageAnalysis";
import { TriageViewSupervisor } from "../../core/triage/triageViewSupervisor";
import {
    TriageAnalysisResultCount,
    TriageChurn,
    PropertyTriageChurn
} from "../../core/triage/tirageAnlaysisResult";
import {
    EntitySpaceViewStateDistribution,
    TriageAndErrorDistribution,
    ViewVersionDuration,
    TriageCommitDuration,
    AllViewStateDistribution,
    ViewVersionLatencyDetail,
    ViewVersionLatency
} from "../../core/triage/triageStatistic";
import {
    MultiChartData,
    SingleChartData
} from "../../core/plugin/ngxChart";
import { Constants } from "../../core/common/constants";
import { TriageReport, TriageReportDetail, ViewVersionMetric } from "../../core/triage/triageReport";

@Injectable()
export class TriageService extends BaseService {
    private triageServiceUrl = `${this.serverUrl}/TriageAnalysis`; // URL to web api
    private epServiceUrl = `${this.serverUrl}/EntityPlatform`; // URL to web api
    private EPProdJobServiceUrl = Constants.EPProdJobServiceUrl;
    constructor(public httpClient: HttpClient) {
        super(httpClient);
    }

    //#region triage analysis
    getEntityView(customerId: string, customerEnv: string, viewKey: string, isForceRefresh: boolean) {
        //return this.http.get(this.getRequestApi(ApiController.TriageAnalysis, RequestAction.AllCustomerIds)).map((response) => response.json());

        //https://blog.angular-university.io/angular-http/
        const httpParams = new HttpParams()
            .set("customerId", customerId)
            .set("customerEnv", customerEnv)
            .set("viewKey", viewKey)
            .set("isForceRefresh", isForceRefresh.toString());
        //const httpParams = new HttpParams().append('customerId', customerId).append('customerEnv', customerEnv).append('viewKey', viewKey);
        this.logger.info(httpParams.toString());
        return this.httpClient.get<EntityView>(
            `${this.triageServiceUrl}/entityView`,
            {
                params: httpParams
                //headers: new HttpHeaders().set('responseType', 'blob'),
            }
        ); //.map((response) => response.json());
    }

    downloadFunctoid(
        customerId: string,
        customerEnv: string,
        viewKey: string,
        dotSplitedVersionNum: string,
        functoidName: string
    ) {
        const httpParams = new HttpParams()
            .set("customerId", customerId)
            .set("customerEnv", customerEnv)
            .set("viewKey", viewKey)
            .set("dotSplitedVersionNum", dotSplitedVersionNum)
            .set("functoidName", functoidName);
        return this.httpClient.get(`${this.epServiceUrl}/functoid`, {
            observe: "response",
            params: httpParams,
            responseType: "arraybuffer"
            //responseType: 'blob'
            //headers: new HttpHeaders().set('Content-Type', 'undefined')
        });
    }

    downloadMappingFile(
        customerId: string,
        customerEnv: string,
        viewKey: string,
        dotSplitedVersionNum: string,
        mappingFileName: string
    ) {
        const httpParams = new HttpParams()
            .set("customerId", customerId)
            .set("customerEnv", customerEnv)
            .set("viewKey", viewKey)
            .set("dotSplitedVersionNum", dotSplitedVersionNum)
            .set("mappingFileName", mappingFileName);
        return this.httpClient.get(`${this.epServiceUrl}/mappingFile`, {
            observe: "response",
            params: httpParams,
            responseType: "text"
            //responseType: 'blob'
            //headers: new HttpHeaders().set('Content-Type', 'undefined')
        });
    }

    downloadWrapstarModel(
        modelId: string,
        modelVersion: string
    ) {
        const httpParams = new HttpParams()
            .set("modelId", modelId)
            .set("modelVersion", modelVersion)
        return this.httpClient.get(`${this.triageServiceUrl}/downloadModel`, {
            observe: "response",
            params: httpParams,
            responseType: "text"
        });
    }

    getWrapstarModelVersion(
        customerId: string,
        customerEnv: string,
        viewKey: string,
        dotSplitedVersionNum: string,
        mappingFileName: string
    ) {
        const httpParams = new HttpParams()
            .set("customerId", customerId)
            .set("customerEnv", customerEnv)
            .set("viewKey", viewKey)
            .set("dotSplitedVersionNum", dotSplitedVersionNum)
            .set("mappingFileName", mappingFileName);
        return this.httpClient.get<Array<Revision>>(`${this.triageServiceUrl}/modelVersion`, {
            params: httpParams
        });
    }

    getTriageAnalysis(
        customerId: string,
        customerEnv: string,
        viewKey: string,
        standardVersion: string,
        triagedVersion: string
    ) {
        const httpParams = new HttpParams()
            .set("customerId", customerId)
            .set("customerEnv", customerEnv)
            .set("viewKey", viewKey)
            .set("standardVersion", standardVersion)
            .set("triagedVersion", triagedVersion);

        return this.httpClient.get<TriageAnalysis>(
            `${this.triageServiceUrl}/triageAnalysis`,
            {
                params: httpParams
            }
        );
    }

    submitTriageAnalysisJob(
        isForceSubmission: boolean,
        vc: string,
        cloudPriority: number,
        triageAnalysisDto: TriageAnalysisDto
    ) {
        return this.httpClient.post(
            `${this.triageServiceUrl}/triageAnalsisJob`,
            {
                isForceSubmission: isForceSubmission,
                cloudPriority: cloudPriority,
                vc: vc,
                triageAnalysisDto: triageAnalysisDto
            },
            { headers: new HttpHeaders().set("User", "jixge") }
        );
    }

    cancelTriageAnalysisJob(jobId: number) {
        const httpParams = new HttpParams().set("jobId", jobId.toString());
        return this.httpClient.delete(
            `${this.triageServiceUrl}/triageAnalsisJob`,
            {
                headers: new HttpHeaders().set("User", "jixge"),
                params: httpParams
            }
        );
    }

    getTriageAnalysisResultCount(resultId: number) {
        const httpParams = new HttpParams().set(
            "resultId",
            resultId.toString()
        );
        return this.httpClient.get<TriageAnalysisResultCount>(
            `${this.triageServiceUrl}/triageAnalysisResultCount`,
            {
                headers: new HttpHeaders().set("User", "jixge"),
                params: httpParams
            }
        );
    }

    getTriageResultByChurnType(resultId: number, churnType: string) {
        const httpParams = new HttpParams()
            .set("resultId", resultId.toString())
            .set("churnType", churnType);
        return this.httpClient.get<TriageChurn>(
            `${this.triageServiceUrl}/triageResultByChurnType`,
            { params: httpParams }
        );
    }

    getTriageResultByProperty(resultId: number, property: string, debugStream: string) {
        let httpParams = new HttpParams()
            .set("resultId", resultId.toString())
            .set("property", property)
            .set("debugStream", debugStream);

        return this.httpClient.get<PropertyTriageChurn>(
            `${this.triageServiceUrl}/triageResultByProperty`,
            { params: httpParams }
        );
    }

    getTriageAnalysisJob(jobId: number) {
        const httpParams = new HttpParams().set("jobId", jobId.toString());
        return this.httpClient.get(
            `${this.triageServiceUrl}/triageAnalsisJob`,
            { params: httpParams }
        );
    }

    getExtraProperties(triageAnalysisId: number, resultId: number) {
        const httpParams = new HttpParams()
            .set("triageAnalysisId", triageAnalysisId.toString())
            .set("resultId", resultId.toString());
        return this.httpClient.get(
            `${this.triageServiceUrl}/triageResultExtraProperties`,
            { params: httpParams }
        );
    }

    getSideBySideProperties(resultId: number) {
        const httpParams = new HttpParams()
            .set("resultId", resultId.toString());
        return this.httpClient.get(
            `${this.triageServiceUrl}/triageResultSBSProperties`,
            { params: httpParams }
        );
    }

    getSideBySidePairsByProperty(resultId: number, property: string) {
        const httpParams = new HttpParams()
            .set("property", property.toString())
            .set("resultId", resultId.toString());
        return this.httpClient.get(
            `${this.triageServiceUrl}/triageResultSBSPairsByProperty`,
            { params: httpParams }
        );
    }

    commitTriagedView(
        customerId: string,
        customerEnv: string,
        entitySpaceName: string,
        viewName: string,
        comment: string
    ) {
        const httpParams = new HttpParams()
            .set("customerId", customerId)
            .set("environmentName", customerEnv)
            .set("entitySpaceName", entitySpaceName)
            .set("viewName", viewName)
            .set("commitComment", comment);
        return this.httpClient.get(`${this.EPProdJobServiceUrl}/EntitySpace/CommitEntitySpaceView`, {
            params: httpParams,
            withCredentials: true
        });
    }
    //#endregion

    //#region triage supervisor
    getTriageViewSupervisors() {
        return this.httpClient.get<Array<TriageViewSupervisor>>(
            `${this.triageServiceUrl}/triageViewSupervisor`,
            {}
        );
    }

    addTriageViewSupervisor(
        customerId: string,
        customerEnv: string,
        entitySapce: string,
        entitySapceView: string,
        segment: string,
        owner: string
    ) {
        return this.httpClient.post<TriageViewSupervisor>(
            `${this.triageServiceUrl}/triageViewSupervisor`,
            {
                customerId: customerId,
                customerEnv: customerEnv,
                entitySpace: entitySapce,
                entitySpaceView: entitySapceView,
                segment: segment,
                owner: owner
            },
            { headers: new HttpHeaders().set("User", "jixge") }
        );
    }

    updateTriageViewSupervisor(triageSupervisor: TriageViewSupervisor) {
        return this.httpClient.put<TriageViewSupervisor>(
            `${this.triageServiceUrl}/updateTriageViewSupervisor`,
            {
                customerId: triageSupervisor.customerId,
                customerEnv: triageSupervisor.customerEnv,
                entitySpace: triageSupervisor.entitySpaceName,
                entitySpaceView: triageSupervisor.entitySpaceViewName,
                segment: triageSupervisor.segment,
                owner: triageSupervisor.owner
            },
            { headers: new HttpHeaders().set("User", "jixge") }
        );
    }

    deleteTriageViewSupervisor(triageSupervisorId: number) {
        const httpParams = new HttpParams().set("triageViewSupervisorId", triageSupervisorId.toString());
        return this.httpClient.delete<TriageViewSupervisor>(
            `${this.triageServiceUrl}/deleteTriageViewSupervisor`,
            { params: httpParams }
        );
    }

    getEntitySpaceViewStateDistribution() {
        return this.httpClient.get<Array<EntitySpaceViewStateDistribution>>(
            `${this.triageServiceUrl}/entitySpaceViewStateDistribution`,
            {}
        );
    }

    getViewStateDistribution() {
        return this.httpClient.get<AllViewStateDistribution>(
            `${this.triageServiceUrl}/viewStateDistribution`,
            {}
        );
    }
    //#endregion

    //#region statistic
    getTriageAndErrorDistributionResult() {
        return this.httpClient.get<TriageAndErrorDistribution[]>(
            `${this.triageServiceUrl}/triageAndErrorDistribution`,
            {}
        );
    }

    getVersionDelayResult(statisticId: number) {
        const httpParams = new HttpParams().set(
            "statisticId",
            statisticId.toString()
        );
        return this.httpClient.get<ViewVersionDuration>(
            `${this.triageServiceUrl}/viewVersionDuration`,
            { params: httpParams }
        );
    }

    getAllViewVersionDelaysResult() {
        return this.httpClient.get<ViewVersionDuration[]>(
            `${this.triageServiceUrl}/allViewVersionDurations`,
            {}
        );
    }

    getAllFakeTriageViewVersionDurations() {
        return this.httpClient.get<ViewVersionDuration[]>(
            `${this.triageServiceUrl}/allFakeTriageViewVersionDurations`,
            {}
        );
    }

    getCommitDelayResult(statisticId: number) {
        const httpParams = new HttpParams().set(
            "statisticId",
            statisticId.toString()
        );
        return this.httpClient.get<TriageCommitDuration>(
            `${this.triageServiceUrl}/triageCommitDuration`,
            { params: httpParams }
        );
    }

    getMonthlyCountResult(statisticId: number) {
        const httpParams = new HttpParams().set(
            "statisticId",
            statisticId.toString()
        );
        return this.httpClient.get<TriageAndErrorDistribution>(
            `${this.triageServiceUrl}/singleViewTriageAndErrorDistribution`,
            { params: httpParams }
        );
    }

    getViewVersionDetail(statisticId: number, startTime: string, endTime: string) {
        const httpParams = new HttpParams()
            .set("supervisorId", statisticId.toString())
            .set("startTime", startTime)
            .set("endTime", endTime);
        return this.httpClient.get<Array<ViewVersionLatencyDetail>>(
            `${this.triageServiceUrl}/viewVersionDetail`,
            { params: httpParams }
        );
    }

    getViewVersionLatency(statisticId: number, startTime: string, endTime: string) {
        const httpParams = new HttpParams()
            .set("supervisorId", statisticId.toString())
            .set("startTime", startTime)
            .set("endTime", endTime);
        return this.httpClient.get<Array<ViewVersionLatency>>(
            `${this.triageServiceUrl}/viewVersionLatency`,
            { params: httpParams }
        );
    }
    //#endregion

    //#region triage report
    getTriageReport(reportTimeSpan: string,  type: ReportType, forceGenerate: boolean) {
        const httpParams = new HttpParams()
            .set("reportTimeSpan", reportTimeSpan)
            .set("type", type.toString())
            .set("forceGenerate", forceGenerate.toString());
        return this.httpClient.get<TriageReport>(
            `${this.triageServiceUrl}/triageReport`,
            { params: httpParams }
        );
    }

    getTriageReportTimeSpansByReportType(reportType: string) {
        const httpParams = new HttpParams().set(
            "reportType", reportType
        );
        return this.httpClient.get<Array<string>>(
            `${this.triageServiceUrl}/triageReportTimeSpans`,
            { params: httpParams }
        );
    }

    getTriageReportDetail(statisticId: number, startTime: string, endTime: string) {
        const httpParams = new HttpParams()
            .set("supervisorId", statisticId.toString())
            .set("startTime", startTime)
            .set("endTime", endTime);
        return this.httpClient.get<TriageReportDetail>(
            `${this.triageServiceUrl}/triageReportDetail`,
            { params: httpParams }
        );
    }

    getViewVersionMetric(startTime: string, endTime: string){
        const httpParams = new HttpParams()
            .set("startTime", startTime)
            .set("endTime", endTime);
        return this.httpClient.get<ViewVersionMetric>(
            `${this.triageServiceUrl}/viewVersionMetric`,
            { params: httpParams }
        );
    }
    //#endregion

    private handleError(error: any): Promise<any> {
        console.error("An error occurred", error); // for demo purposes only
        return Promise.reject(error.message || error);
    }
}
