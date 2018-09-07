import { Injectable } from "@angular/core";
import { BaseService } from "../common/base.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ViewerTriple } from "../../core/viewer/entityDiffViewer";
import { ViewerPayloadDiff } from "../../core/viewer/PayloadDiffViewer";
import { ViewerType } from "../../core/enums";

@Injectable()
export class ViewerService extends BaseService {
	private viewerServiceUrl = `${this.serverUrl}/viewer`;

	constructor(public httpClient: HttpClient) {
		super(httpClient);
	}

	getViewerTriples(
        viewerType: ViewerType,
		subject1: string,
		subject2: string,
		standardRelativeStreamPath: string,
		triagedRelativeStreamPath: string
	) {
        const httpParams = new HttpParams()
            .set("viewerType", viewerType.toString())
			.set("subject1", subject1.trim())
			.set("subject2", subject2.trim())
			.set("standardRelativeStreamPath", standardRelativeStreamPath.trim())
			.set("triagedRelativeStreamPath", triagedRelativeStreamPath.trim());
		return this.httpClient.get<ViewerTriple>(`${this.viewerServiceUrl}/entityDiff`, {
			params: httpParams
		});
	}

	getViewerPayloadDiff(
        viewerType: ViewerType,
        modelIdStr: string,
		externalId1: string,
		externalId2: string,
		standardEpRelativeStreamPath: string,
		triageEpRelativeStreamPath: string
	) {
        const httpParams = new HttpParams()
			.set("viewerType", viewerType.toString())
			.set("modelIdStr", modelIdStr == null ? modelIdStr : modelIdStr.trim())
			.set("externalId1", externalId1.trim())
			.set("externalId2", externalId2.trim())
			.set("standardRelativeStreamPath", standardEpRelativeStreamPath.trim())
			.set("triagedRelativeStreamPath", triageEpRelativeStreamPath.trim());
		return this.httpClient.get<ViewerPayloadDiff>(`${this.viewerServiceUrl}/payloadDiff`, {
			params: httpParams
		});
	}
}
