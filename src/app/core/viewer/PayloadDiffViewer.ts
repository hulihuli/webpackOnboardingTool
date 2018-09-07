export class ViewerPayloadDiff {
	constructor(
        public subject?: string, 
        public payloadDiffProperties?: Array<ViewerPayloadDiffProperty>
    ) {
		this.payloadDiffProperties = new Array<ViewerPayloadDiffProperty>();
	}
}

export class ViewerPayloadDiffProperty {
	constructor(
        public property?: string, 
        public commonValues?: Array<string>, 
        public standardValues?: Array<string>, 
        public triagedValues?: Array<string>,
    ) {
		this.commonValues = new Array<string>();
		this.standardValues = new Array<string>();
		this.triagedValues = new Array<string>();
	}
}
