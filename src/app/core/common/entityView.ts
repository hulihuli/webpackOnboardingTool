import { Constants } from '../../core/common/constants'
import { Revision, DebugInfo } from '../triage/triageAnalysis';

export class Functoid{
    constructor(
        public name: string,
        public isDownloading: boolean
    ){
        this.isDownloading = false;
    }
}

export class MappingFile{
    constructor(
        public name?:string,
        public version?: string,//dot splited
        public majorVersion?: number,
        public minorVersion?: number,
        public isDownloading?: boolean,
        public modelRevisions?: Array<Revision>
    ){
        this.isDownloading = false;
        this.modelRevisions = new Array<Revision>();
    }
}

export class MappingSetting{
    constructor(
        public mappingFiles?: MappingFile[],
        public functoids?: Functoid[]
    ){}
}

export class EntityViewVersion{
    constructor(
        public state?: string,
        public virtualCluster?: string,
        public vcRelativeFolder?: string,
        public mappingSetting?: MappingSetting,
        public lastUpdatedTime?: string,
        public majorVersion?: number,
        public minorVersion?: number,  
        public buildNumber?: number,
        public version?: string,
        public sharedStreamFolder?: string,
        public relativeStreamPath?: string,
        public viewStreamPath?: string,
        public entitySpaceStreamPath?: string,
        public fullDebugStreamFolder?: string,
        public relativeDebugStreamFolder?: string
    ){
        this.mappingSetting = new MappingSetting();
    }
    // get version(): string {
    //     return `${this.majorVersion}.${this.minorVersion}.${this.buildNumber}`;
    // }
    
    // get relativeStreamPath(): string{
    //     if (!this.virtualCluster || !this.vcRelativeFolder){
    //         return "";
    //     }

    //     var len = this.virtualCluster.length;
    //     var virtualCluster = this.virtualCluster;
    //     if (virtualCluster[len - 1] == '/')
    //     {
    //         virtualCluster = virtualCluster.substring(len - 1);
    //     }
    //     var slashPos = virtualCluster.lastIndexOf("/");
    //     var vcNameWithoutPrefix = virtualCluster.substring(slashPos + 1);

    //     return `/shares/${vcNameWithoutPrefix}${this.vcRelativeFolder}${Constants.streamView}`;
    // }

    // get viewStreamPath(): string{
    //     if (!this.virtualCluster || !this.vcRelativeFolder){
    //         return "";
    //     }

    //     return `${this.virtualCluster}${this.vcRelativeFolder}${Constants.streamView}`;
    // }
    
    // get entitySpaceStreamPath(): string{
    //     if (!this.virtualCluster || !this.vcRelativeFolder){
    //         return "";
    //     }

    //     let len = this.vcRelativeFolder.length;
    //     let entitySpaceFolderslashPos = this.vcRelativeFolder.substr(0, len - 1).lastIndexOf("/");
    //     let entitySpaceRelativeFolder = this.vcRelativeFolder.substr(0, entitySpaceFolderslashPos + 1);
    //     return `${this.virtualCluster}${entitySpaceRelativeFolder}${Constants.streamEntitySpace}`;
    // }

    // get entitySpaceDebugStreamFolder(): string{
    //     if (!this.virtualCluster || !this.vcRelativeFolder){
    //         return "";
    //     }

    //     return `${this.virtualCluster}${this.vcRelativeFolder}${Constants.streamView}`;
    // }
}

export class EntityView{
    constructor(
        public viewKey?: string,
        public customerId?: string,
        public customerEnv?: string,
        public entitySpaceName?: string,
        public entitySpaceViewName?: string,
        public model?: string,
        public state?: string,
        public createdBy?: string,
        public createdTime?: string,
        public updatedTime?: string,
        public entitySpaceUrl?: string,
        public entityViewUrl?: string,
        public standardVersions?: EntityViewVersion[],
        public triagedVersions?: EntityViewVersion[],
        public debugInfo?: DebugInfo
      ) {
          this.standardVersions = new Array<EntityViewVersion>();
          this.triagedVersions = new Array<EntityViewVersion>();
      }
}

export class SimplifiedCustomer {
    constructor(
        public customerId?: string,
        public customerEnvs?: Array<string>
    ) { 
        this.customerEnvs = new Array<string>();
    }
}

export class SimplifiedEntitySpace {
    constructor(
        public entitySpace?: string,
        public entitySpaceViews?: Array<string>
    ) {
        this.entitySpaceViews = new Array<string>();
    }
}

export class EntityViewKey {
    constructor(
        public viewKey?: string,
        public entitySpace?: string,
        public entitySpaceView?: string
    ) {
    }
}