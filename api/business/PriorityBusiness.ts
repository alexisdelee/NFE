import { makeCoffee } from "../decorators/wrapper";
import { PriorityRepository } from "../repositories/PriorityRepository";
import { Priority } from "../entities/Priority";
import { Request } from "../utils/QueryWrapper";

export class PriorityBusiness {
    constructor(public priority: Priority) {
    }

    @makeCoffee
    public static *find(priority: Priority): IterableIterator<any> {
        return yield new PriorityRepository().find(priority, Request.FetchType.Eager);
    }

    @makeCoffee
    public static *findOne(priorityId: number): IterableIterator<any> {
        return yield new PriorityRepository().findOne(priorityId, Request.FetchType.Eager);
    }
}
