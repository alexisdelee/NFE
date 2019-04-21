import { makeCoffee } from "../decorators/wrapper";
import { PriorityRepository } from "../repositories/PriorityRepository";
import { Priority } from "../entities/Priority";
import { Request } from "../utils/QueryWrapper";

export class PriorityData {
    constructor(
        public readonly trivial: Priority,
        public readonly minor: Priority,
        public readonly major: Priority,
        public readonly critical: Priority,
        public readonly blocker: Priority
    ) {
    }

    @makeCoffee
    public static *create(): IterableIterator<any> {
        return new PriorityData(
            <Priority>(yield new PriorityRepository().findBySynchro("trivial", Request.FetchType.Eager)),
            <Priority>(yield new PriorityRepository().findBySynchro("minor", Request.FetchType.Eager)),
            <Priority>(yield new PriorityRepository().findBySynchro("major", Request.FetchType.Eager)),
            <Priority>(yield new PriorityRepository().findBySynchro("critical", Request.FetchType.Eager)),
            <Priority>(yield new PriorityRepository().findBySynchro("blocker", Request.FetchType.Eager))
        );
    }
}
