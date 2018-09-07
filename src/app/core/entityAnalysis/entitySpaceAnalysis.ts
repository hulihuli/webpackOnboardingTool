import { EntityAnalysis } from "./entityAnalysis";

export class EntitySpaceAnalysis extends EntityAnalysis{
    constructor(
        id: number,
        name: string,
        createdBy: string,
        createdTime: string,
        updatedBy: string,
        updatedTime: string,
        customerId: string,
        customerEnv: string,
        entitySpaceName: string,
        entitySpaceVersion: string,
    )
    {
        super(id, name, createdBy, createdTime, updatedBy, updatedTime, customerId, customerEnv);
    }
}