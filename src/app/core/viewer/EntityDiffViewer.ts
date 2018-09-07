export class ViewerTriple {
	constructor(
        public subject?: string, 
        public viewerDiffProperties?: Array<ViewerDiffProperty>
    ) {
		this.viewerDiffProperties = new Array<ViewerDiffProperty>();
	}
}

export class ViewerDiffProperty {
	constructor(
        public property?: string, 
        public commonValues?: Array<string>, 
        public standardValues?: Array<string>, 
        public triagedValues?: Array<string>,
        public standardExist?:boolean,
        public triagedExist?:boolean
    ) {
		this.commonValues = new Array<string>();
		this.standardValues = new Array<string>();
		this.triagedValues = new Array<string>();
	}
}
