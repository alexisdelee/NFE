import { makeCoffee } from "../decorators/wrapper";
import { TrackerRepository } from "../repositories/TrackerRepository";
import { Tracker } from "../entities/Tracker";
import { Request } from "../utils/QueryWrapper";

export class TrackerData {
    constructor(
        public readonly incident: Tracker,
        public readonly defect: Tracker,
        public readonly intervention: Tracker,
        public readonly sicknessLeave: Tracker,
        public readonly paidLeave: Tracker
    ) {
    }

    @makeCoffee
    public static *create(): IterableIterator<any> {
        return new TrackerData(
            <Tracker>(yield new TrackerRepository().findBySynchro("incident", Request.FetchType.Eager)),
            <Tracker>(yield new TrackerRepository().findBySynchro("defect", Request.FetchType.Eager)),
            <Tracker>(yield new TrackerRepository().findBySynchro("intervention", Request.FetchType.Eager)),
            <Tracker>(yield new TrackerRepository().findBySynchro("sickness_leave", Request.FetchType.Eager)),
            <Tracker>(yield new TrackerRepository().findBySynchro("paid_leave", Request.FetchType.Eager)),
        );
    }
}
