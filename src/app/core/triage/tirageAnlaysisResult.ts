
export class PropertyValue {
    constructor(
        public value?: string,
        public contexts?: Array<string>
    ) {
        //this.contexts = new Array<string>();
    }
}

export class EntityComparison {
    constructor(
        public subject?: string,
        public propertyValueComparisons?: Array<PropertyValueComparison>
    ) {
        //this.subjectValueComparisons = new Array<EntityValueComparison>();
    }
}

export class PropertyValueComparison {
    constructor(
        public property?: string,
        public isFirst?: boolean,
        public standardValues?: Array<PropertyValue>,
        public triagedValues?: Array<PropertyValue>,
        //public sourceUrls?: Array<string>,
        public sourceAndRootUrls?:Array<SourceAndRootUrl>
    ) {
        // this.standardValues = new Array<PropertyValue>();
        // this.triagedValues = new Array<PropertyValue>();
    }
}


export class PropertyComparison {
    constructor(
        public property?: string,
        public subjectValueComparisons?: Array<SubjectValueComparison>
    ) {
        //this.subjectValueComparisons = new Array<EntityValueComparison>();
    }
}

export class SubjectValueComparison {
    constructor(
        public subject?: string,
        public isFirst?: boolean,
        public standardValues?: Array<PropertyValue>,
        public triagedValues?: Array<PropertyValue>,
        //public sourceUrls?: Array<string>,
        public sourceAndRootUrls?:Array<SourceAndRootUrl>        
    ) {
        // this.standardValues = new Array<PropertyValue>();
        // this.triagedValues = new Array<PropertyValue>();
    }
}

export class ValueComparison {
    constructor(
        public subject?: string,
        public property?: boolean,
        public standardValues?: Array<PropertyValue>,
        public triagedValues?: Array<PropertyValue>,
        //public sourceUrls?: Array<string>,
        public sourceAndRootUrls?:Array<SourceAndRootUrl>        
    ) {
        // this.standardValues = new Array<PropertyValue>();
        // this.triagedValues = new Array<PropertyValue>();
    }
}


export class TriageLayer {
    constructor(
        public entity?: Array<EntityComparison>,
        public property?: Array<PropertyComparison>,
        public value?: Array<ValueComparison>,
    ) {
        this.entity = new Array<EntityComparison>();
        this.property = new Array<PropertyComparison>();
        this.value = new Array<ValueComparison>();
    }
}

export class TriageChurn {
    constructor(
        public deleted?: TriageLayer,
        public churned?: TriageLayer,
        public added?: TriageLayer,
    ) {
        this.deleted = new TriageLayer();
        this.churned = new TriageLayer();
        this.added = new TriageLayer();
    }
}

export class TriageAnalysisResult {
    constructor(
        public triageAnalysisId?: number,
        public valueChurn?: TriageChurn,
        public pipelineTopEntitiesChurn?: TriageChurn,
        public pipelineTypeChurn?: TriageChurn,
        public pipelineChurn?: TriageChurn,
        public pipelineUpdatedEntitesChurn?: TriageChurn,
        public updatedEntitesChurn?: TriageChurn,
    ) {
        // this.valueChurn = new TriageChurn();
        // this.pipelineTopEntitiesChurn = new TriageChurn();
        // this.pipelineTypeChurn = new TriageChurn();
        // this.pipelineChurn = new TriageChurn();
        // this.pipelineUpdatedEntitesChurn = new TriageChurn();
    }
}


export class LayerCount {
    constructor(
        public entityCount?: number,
        public propertyCount?: number,
        public valueCount?: number,
        public totalCount?: number
    ) { }
}

export class ChurnCount {
    constructor(
        public deletedLayerCount?: LayerCount,
        public addedLayerCount?: LayerCount,
        public churnedLayerCount?: LayerCount,
        public totalCount?: number
    ) {
        this.deletedLayerCount = new LayerCount();
        this.addedLayerCount = new LayerCount();
        this.churnedLayerCount = new LayerCount();
    }
}

export class DebugStreamExistense {
    constructor(
        public valueChurnCount?: boolean,
        public pipelineTopEntitiesChurnCount?: boolean,
        public pipelineTypeChurnCount?: boolean,
        public updatedEntitiesChurnCount?: boolean,
        public pipelineUpdatedEntitiesChurnCount?: boolean,
        public pipelineChurnCount?: boolean
    ) { }
}

export class TriageAnalysisResultCount {
    constructor(
        public debugStreamExistense?: DebugStreamExistense,
        public valueChurnCount?: ChurnCount,
        public pipelineTopEntitiesChurnCount?: ChurnCount,
        public pipelineTypeChurnCount?: ChurnCount,
        public updatedEntitiesChurnCount?: ChurnCount,
        public pipelineUpdatedEntitiesChurnCount?: ChurnCount,
        public pipelineChurnCount?: ChurnCount
    ) {
        this.debugStreamExistense = new DebugStreamExistense();
        this.valueChurnCount = new ChurnCount();
        this.pipelineTopEntitiesChurnCount = new ChurnCount();
        this.pipelineTypeChurnCount = new ChurnCount();
        this.updatedEntitiesChurnCount = new ChurnCount();
        this.pipelineUpdatedEntitiesChurnCount = new ChurnCount();
        this.pipelineChurnCount = new ChurnCount();
    }
}

export class PropertyTriageChurn {
    constructor(
        public triageChurn?: TriageChurn,
        public churnCount?: ChurnCount
    ) {
        this.triageChurn = new TriageChurn();
        this.churnCount = new ChurnCount();
    }
}

export class TriageAnalysisResultType {
    constructor(
        public deletedEntity?: boolean,
        public deletedProperty?: boolean,
        public deletedValue?: boolean,
        public addedEntity?: boolean,
        public addedProperty?: boolean,
        public addedValue?: boolean,
        public churn?: boolean,
    ) { }
}

export class SourceAndRootUrl {
    constructor(
        public sourceUrl: string,
        public rootSubject: string,
        public rootUrl: string
    ){}
}