import { LogLevel } from "../../src/app/core/enums";

export const environmentProd = {
	serverBaseUrl: "http://stcazr-264:9000/api",
	defaultVC: "https://cosmos08.osdinfra.net/cosmos/Knowledge/",
	defaultCouldPriority: 1000,
    logLevel: LogLevel.Error,
    enableAAD: true,
	adalConfig: {
		tenant: "microsoft.onmicrosoft.com",
		clientId: "0fca5598-049c-4306-8447-f06325e52640", //registered application's Id (GUID)
		postLogoutRedirectUri: "http://onboardingtool:8060/logout",
		//redirectUri: "http://onboardingtool:8060/"//comment this field to return current url after authentication
	}
};
