import {AnalysisType} from './enums'

export class ExperimentDto{
    constructor(
        public id: number,
        public name: string,
        public type: AnalysisType,
        public createdBy: string,
        public createdTime: string,
        public updatedBy: string,
        public updatedTime: string,
        public entitySpaceName?: string,
        public entitySpaceUrl?: string,
        public entityViewName?: string,
        public entityViewUrl?: string,
        public customerId?: string,
        public customerEnv?: string,
      ) {  }
}