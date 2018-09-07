import { LocalStorageService, SessionStorageService } from "ngx-webstorage";
import { WebStorageType } from "../core/enums";
import { environment } from "../../../config/environment/environment";

export class Record {
	constructor(
        public value?: any, 
        public expirationTime?: number
    ) 
    {}
}

export class WebStorage {
	public storage: any;
	constructor(public localSt: LocalStorageService, public sessionSt: SessionStorageService, public type: WebStorageType = environment.defaultStorageType) {
        //notice: WebStorageType is a default parameter, the default value is in enviroment
		if (type == WebStorageType.LocalStorage) {
			this.storage = localSt;
		} else if (type == WebStorageType.SessionStorage) {
			this.storage = sessionSt;
		}
	}

	saveValue(key: string, value: any, expirationMins: number = environment.defaultExpirationMin) {
        //notice: expirationMin is count by minute, and expirationMin is a default parameter, the default value is in enviroment
		let expirationTime = expirationMins * 60 * 1000;//expirationMs is count by millisecond
		let record = new Record(value, new Date().getTime() + expirationTime);
		this.storage.store(key, record);
	}

	retrieveValue(key: string) {
		let record: Record = this.storage.retrieve(key);
        let now = new Date().getTime();
		if (now > record.expirationTime) {
			this.clearItem(key);
		}
		return this.storage.retrieve(key);
	}

	clearItem(key: string) {
		this.storage.clear(key);
    }
    
    clearAll() {
        this.storage.clear();
    }

	isStorageAvailable() {
		return this.storage.isStorageAvailable();
	}

    //To observer key's history
	observe(key: string) {
		this.storage.observe(key).subscribe((newValue: any) => {
			console.log(newValue);
		});
	}
}
