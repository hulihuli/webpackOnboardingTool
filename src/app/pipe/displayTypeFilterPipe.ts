import { Injectable, Pipe, PipeTransform } from "@angular/core";
import { Constants } from "../core/common/constants";

@Pipe({
    name: 'displayTypeFilter',
    pure: false
})

@Injectable()

export class DisplayTypeFilterPipe implements PipeTransform {
    transform(supervisors: any[], displayType: any) {
        if (displayType === "LongToGraph") {
            return supervisors.filter(supervisor => 
                (supervisor.originalState == "EveryVersion" && Number(supervisor.latestSucceedVersionLatency) > Constants.everyVersionLimit) ||
                (supervisor.originalState == "MajorVersion" && Number(supervisor.latestSucceedVersionLatency) > Constants.majorVersionLimit) ||
                (supervisor.originalState == "Manual" && Number(supervisor.latestSucceedVersionLatency) > Constants.manualLimit)
            )
        }
        else if (displayType === "MissState") {
            return supervisors.filter(supervisor => supervisor.currentState != supervisor.originalState)
        }
        else {
            return supervisors.filter(supervisor => displayType === 'All' || supervisor.latestVersionState === displayType);
        }
    }
}

