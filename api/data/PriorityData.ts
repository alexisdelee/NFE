import { makecoffee } from "../decorators/wrapper";
import { PriorityRepository } from "../repositories/PriorityRepository";
import { Priority } from "../entities/Priority";

export class PriorityData {
    constructor(
        public readonly trivial: Priority,
        public readonly minor: Priority,
        public readonly major: Priority,
        public readonly critical: Priority,
        public readonly blocker: Priority
    ) {
    }

    @makecoffee
    public static *create(): IterableIterator<any> {
        return new PriorityData(
            <Priority>(yield new PriorityRepository().findBySynchro("trivial")),
            <Priority>(yield new PriorityRepository().findBySynchro("minor")),
            <Priority>(yield new PriorityRepository().findBySynchro("major")),
            <Priority>(yield new PriorityRepository().findBySynchro("critical")),
            <Priority>(yield new PriorityRepository().findBySynchro("blocker"))
        );
    }
}