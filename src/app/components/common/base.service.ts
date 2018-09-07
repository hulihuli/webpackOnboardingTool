import { OnInit } from '@angular/core';
import {
	HttpClient,
	HttpParams} from "@angular/common/http";

import { ApiController } from '../../core/enums'
import { RequestAction } from '../../core/enums'
import{ environment } from "../../../../config/environment/environment"
import { BaseComponent } from './base.component';
import { SimplifiedCustomer, SimplifiedEntitySpace } from '../../core/common/entityView';

export class BaseService extends BaseComponent implements OnInit {
    serverUrl: string = environment.serverBaseUrl; //"http://localhost:9000/api";//"http://stcvm-961:9000/api";
    entityPlatformServiceUrl = `${this.serverUrl}/EntityPlatform`;

    ApiController: typeof ApiController = ApiController;
    
    
	constructor(public httpClient: HttpClient) {
		super();
	}

    ngOnInit() { }

    getRequestApi(apiController: ApiController, requestAction: RequestAction, id?: number): string{
        if (id !== undefined){
            return `${this.serverUrl}/${ApiController[apiController]}/${id}/${RequestAction[requestAction]}`;
        }else{
            return `${this.serverUrl}/${ApiController[apiController]}/${RequestAction[requestAction]}`;
        }
    }

    getCustomerIds() {
		return this.httpClient.get<Array<SimplifiedCustomer>>(
			`${this.entityPlatformServiceUrl}/allCustomerIds`, {}
		); 
    }

    getEntitySpaces(customerId: string, customerEnv: string) {
        const httpParams = new HttpParams()
			.set("customerId", customerId)
			.set("customerEnv", customerEnv);
		this.logger.info(httpParams.toString());
		return this.httpClient.get<Array<SimplifiedEntitySpace>>(
			`${this.entityPlatformServiceUrl}/allEntitySpaces`,
			{
				params: httpParams
			}
		);
    }
}