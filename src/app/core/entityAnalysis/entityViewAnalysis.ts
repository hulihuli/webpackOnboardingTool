import { EntityAnalysis } from "./entityAnalysis"

export class EntityViewAnalysis extends EntityAnalysis{
    constructor(
        id: number,
        name: string,
        createdBy: string,
        createdTime: string,
        updatedBy: string,
        updatedTime: string,
        customerId: string,
        customerEnv: string,
        entityViewName: string,
        entityViewVersion: string,
    )
    {
        super(id, name, createdBy, createdTime, updatedBy, updatedTime, customerId, customerEnv);
    }
}