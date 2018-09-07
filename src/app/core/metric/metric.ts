import { WorkItemState } from "../enums";

export class TfsWorkItemBasic {
	constructor(
		public id: number,
		public title: string,
		public type: string,
		public state: WorkItemState,
		public areaPath: string,
		public project: string,
		public iterationPath: string,
		public assignedTo: string,
		public createdDate: string,
		public createdBy: string,
		public changedDate: string,
		public changedBy: string,
		public resolvedDate: string,
		public resolvedBy: string,
		public closedDate: string,
        public closedBy: string,
        public e2ETailHours: string
	) {}
}

export class OnboardingTfsFeature extends TfsWorkItemBasic {
	constructor(
		public id: number,
		public title: string,
		public type: string,
		public state: WorkItemState,
		public areaPath: string,
		public project: string,
		public iterationPath: string,
		public assignedTo: string,
		public createdDate: string,
		public createdBy: string,
		public changedDate: string,
		public changedBy: string,
		public resolvedDate: string,
		public resolvedBy: string,
		public closedDate: string,
        public closedBy: string,
        public e2ETailHours: string,        
        public userStories: Array<UserStory>,
        public expandUserStory: boolean
	) {
		super(
			id,
			title,
			type,
			state,
			areaPath,
			project,
			iterationPath,
			assignedTo,
			createdDate,
			createdBy,
			changedDate,
			changedBy,
			resolvedDate,
			resolvedBy,
			closedDate,
            closedBy,
            e2ETailHours
		);
	}
}

export class UserStory extends TfsWorkItemBasic {
	constructor(
		public id: number,
		public title: string,
		public type: string,
		public state: WorkItemState,
		public areaPath: string,
		public project: string,
		public iterationPath: string,
		public assignedTo: string,
		public createdDate: string,
		public createdBy: string,
		public changedDate: string,
		public changedBy: string,
		public resolvedDate: string,
		public resolvedBy: string,
		public closedDate: string,
        public closedBy: string,
        public e2ETailHours: string,        
        public parentid: number,
        public ticketingHours: string,//create->queue
        public queuedHours: string,//queue->in progress
        public e2EEngineeringHours: string,//in progress->in progress after head publish
        public e2EHeadHours: string,//create->in progress after head publish
        public engineeringHours: string,//create->in progress
        public userTasks: Array<UserTask>,
        public expandUserTask: boolean
        
	) {
		super(
			id,
			title,
			type,
			state,
			areaPath,
			project,
			iterationPath,
			assignedTo,
			createdDate,
			createdBy,
			changedDate,
			changedBy,
			resolvedDate,
			resolvedBy,
			closedDate,
            closedBy,
            e2ETailHours
		);
	}
}

export class UserTask extends TfsWorkItemBasic {
	constructor(
		public id: number,
		public title: string,
		public type: string,
		public state: WorkItemState,
		public areaPath: string,
		public project: string,
		public iterationPath: string,
		public assignedTo: string,
		public createdDate: string,
		public createdBy: string,
		public changedDate: string,
		public changedBy: string,
		public resolvedDate: string,
		public resolvedBy: string,
		public closedDate: string,
        public closedBy: string,
        public e2ETailHours: string,        
		public parentid: number
	) {
		super(
			id,
			title,
			type,
			state,
			areaPath,
			project,
			iterationPath,
			assignedTo,
			createdDate,
			createdBy,
			changedDate,
			changedBy,
			resolvedDate,
			resolvedBy,
			closedDate,
            closedBy,
            e2ETailHours
		);
	}
}
