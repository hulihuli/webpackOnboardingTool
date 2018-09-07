import { LogLevel } from "../../src/app/core/enums";

export const environmentInt = {
	serverBaseUrl: "http://stcac-135:9070/api",
	defaultVC: "https://cosmos08.osdinfra.net/cosmos/Knowledge.STCA.prod/",
	defaultCouldPriority: 800,
    logLevel: LogLevel.Trace,
    enableAAD: true,
	adalConfig: {
		tenant: "microsoft.onmicrosoft.com",
		clientId: "31997c92-67a4-43be-b535-049e2f5b9e2c", //registered application's Id (GUID)
		postLogoutRedirectUri: "http://stcac-135:8070/logout",
		//redirectUri: "http://localhost:8080/" //comment this field to return current url after authentication
	}
};
