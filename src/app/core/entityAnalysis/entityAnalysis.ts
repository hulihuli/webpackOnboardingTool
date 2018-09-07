export class EntityAnalysis{
    constructor(
        public id: number,
        public name: string,
        public createdBy: string,
        public createdTime: string,
        public updatedBy: string,
        public updatedTime: string,
        public customerId: string,
        public customerEnv: string,
        public nameWithVersion?: string,
    )
    {}
}