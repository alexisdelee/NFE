import { makecoffee } from "../decorators/wrapper";
import { TrackerRepository } from "../repositories/TrackerRepository";
import { Tracker } from "../entities/Tracker";

export class TrackerData {
    constructor(
        public readonly incident: Tracker,
        public readonly defect: Tracker,
        public readonly intervention: Tracker,
        public readonly sicknessLeave: Tracker,
        public readonly paidLeave: Tracker
    ) {
    }

    @makecoffee
    public static *create(): IterableIterator<any> {
        return new TrackerData(
            <Tracker>(yield new TrackerRepository().findBySynchro("incident")),
            <Tracker>(yield new TrackerRepository().findBySynchro("defect")),
            <Tracker>(yield new TrackerRepository().findBySynchro("intervention")),
            <Tracker>(yield new TrackerRepository().findBySynchro("sickness_leave")),
            <Tracker>(yield new TrackerRepository().findBySynchro("paid_leave")),
        );
    }
}
