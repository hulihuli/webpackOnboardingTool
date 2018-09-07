
import { EntityView } from "../common/entityView"
import { TriageMode } from "../enums";
import { TriageChurn, ChurnCount, PropertyValue } from "./tirageAnlaysisResult";

export class Triple{
    constructor(
        public subject: string,
        public property: string,
        public value: string
    ){}
}

// export class TriageDelete{
//     constructor(
//         public triageType: EntityViewVersionState,
//         public entityDelete: string[],
//         public propertyDelete: string[],
//         public valueDelete: string[]
//     ){}
// }

// export class TriageChurn{
//     constructor(
//         public triageType: EntityViewVersionState,
         
//     ){}
// }


// export class TriageAdd{
//     constructor(
//         public triageType: EntityViewVersionState,
         
//     ){}
// }

// export class TriageProperty{
//     constructor(
//         public property: string,
//         public standardValues: string[],
//         public triageValues: string[]
//     ){}
// }

// export class TriageComparison{
//     constructor(
//         public subject: string,
//         public properties: TriageProperty[]){
//     }
// }

// export class TriageDiff{
//     constructor(
//         public triageType: EntityViewVersionState,
//         public entity: TriageComparison,
//         public property: TriageComparison,
//         public value: TriageComparison
//     ){}
// }

export class TriageAnalysis{
    constructor(
        public id?: number,
        public customerId?: string,
        public customerEnv?: string,
        public entitySpaceName?: string,
        public entitySpaceViewName?: string,
        public stardardVersion?: string,
        public triagedVersion?: string,
        public standardViewRelativeStreamPath?: string,
        public triagedViewRelativeStreamPath?: string,
        public triageAnalysisOutputFolder?: string,
        //public entityView?: EntityView,
        public debugInfo?: DebugInfo,
        public resultId?: number,
        public analysisJobId?: number
    ){}
}



export class TriageAnalysisDto{
    constructor(
        //public id?: number,
        public customerId?: string,
        public customerEnv?: string,
        public entitySpaceName?: string,
        public entitySpaceViewName?: string,
        public debugFolderRelativePath?: string,
        public standardVersion?: string,
        public triagedVersion?: string,
        public standardViewRelativeStreamPath?: string,
        public triagedViewRelativeStreamPath?: string
    )
    { }
}


export class DebugInfo{
    constructor(
        public triageDebugInfoThreeColTables?: Array<TriageDebugInfoThreeColTable>,
        public triageDebugInfoFiveColTables?: Array<TriageDebugInfoFiveColTable>,
        public triageDebugInfoSixColTables?:  Array<TriageDebugInfoSixColTable>
    ){
        this.triageDebugInfoThreeColTables = new Array<TriageDebugInfoThreeColTable>();
        this.triageDebugInfoFiveColTables = new Array<TriageDebugInfoFiveColTable>();
        this.triageDebugInfoSixColTables = new Array<TriageDebugInfoSixColTable>();
    }
}

export class TriageDebugInfoTable{
    constructor(
        public title?: string,
        public url?: string,
        public theads?: Array<string> 
    ){}
}

export class TriageDebugInfoThreeColTable extends TriageDebugInfoTable{
    constructor(
        public debugInfoThreeCols: Array<DebugInfoThreeCol>
    ){
        super();
    }
    
}

export class DebugInfoThreeCol{
    constructor(
        public validatorName: string,
        public passPercentage: string,
        public minPercentage: string,
        public expandDetail?: boolean,
        public churnCount?: ChurnCount,
        public triageChurn?: TriageChurn    
    ){
        this.triageChurn = new TriageChurn();        
    }
}

export class TriageDebugInfoFiveColTable extends TriageDebugInfoTable
{
    constructor(
        public debugInfoFiveCols: Array<DebugInfoFiveCol>
    ){
        super();
    }
}

export class DebugInfoFiveCol
{
    constructor(
        public predicate: string,
        public previousValues: string,
        public currentValues: string,
        public change: string,
        public threshold: string,
        public expandDetail?: boolean,
        public churnCount?: ChurnCount,
        public triageChurn?: TriageChurn
    ){
        this.triageChurn = new TriageChurn();
    }
}

export class TriageDebugInfoSixColTable extends TriageDebugInfoTable
{
    constructor(
        public debugInfoSixCols: Array<DebugInfoSixCol>,
        public triageMode: TriageMode
    ){
        super(); 
    }
}

export class DebugInfoSixCol
{
    constructor(
        public predicate: string,
        public previousValues: string,
        public churn: string,
        public change: string,
        public minThreshold: string,
        public maxThreshold: string,
        public expandDetail?: boolean,
        public churnCount?: ChurnCount,
        public triageChurn?: TriageChurn
    ){
        this.triageChurn = new TriageChurn();        
    }
}

export class Revision
{
    constructor(
        public mappingFile: string,
        //public modelId: string,
        public model: string,
        public version: string,
        public modelState: string,
        public created: string,
        public user: string,
        public group: string,
        public isDownloading?: boolean,
        public modelUrl?: string
    ){}
}

export class PropertyInfo{
    constructor(
        public predicate?: string,
        public expandDetail?: boolean,
        public churnCount?: ChurnCount,
        public triageChurn?: TriageChurn,
        public sideBySidePairs?: Array<AddedAndDeletedPair>
    )
    {}
}

export class SourceAndRootUrl
{
    constructor(
        public sourceUrl: string,
        public rootSubject: string,
        public rootUrl: string,
    ){}
}

export class TriageSample
{
    constructor(
        public mode: TriageMode,
        public subject: string,
        public property: string,
        public churnCounter: string,
        public propertyLevel: string,
        public entityLevel: string,
        public standardValues: Array<PropertyValue>,
        public triagedValues: Array<PropertyValue>,
        public sourceUrls: Array<string>,
        public sourceAndRootUrls: Array<SourceAndRootUrl>
    ){
    }
}

export class AddedAndDeletedPair
{
    constructor(
        public added: TriageSample,
        public deleted: TriageSample,
        public property: string) {
    }

}
