import { environmentDev } from "./environment.dev"
import { environmentLocal } from "./environment.local"
import { environmentProd } from "./environment.prod"
import { environmentInt } from "./environment.int"
import { WebStorageType } from "../../src/app/core/enums";


const commonEnv = {
	defaultStorageType: WebStorageType.LocalStorage,
	defaultExpirationMin: 24 * 60
};

export const environment = Object.assign(commonEnv, environmentLocal);