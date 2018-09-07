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

import { BaseService } from "../common/base.service";
import { ApiController, RequestAction } from "../../core/enums";
import { Constants } from "../../core/common/constants";


@Injectable()
export class MetricService extends BaseService {
	private headers = new HttpHeaders({ "Content-Type": "application/json" });
	private metricServiceUrl = `${this.serverUrl}/Metric`; // URL to web api

	constructor(public httpClient: HttpClient) {
		super(httpClient);
	}

	generateTfsMetric(tfsQueryId: string) {
        const httpParams = new HttpParams()
			.set("tfsQueryId", tfsQueryId);
        return this.httpClient.post(`${this.metricServiceUrl}/onboardingTfsMetric`, {}, {headers: this.headers, params: httpParams});
    }
}
