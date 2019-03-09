import { makecoffee } from "../decorators/wrapper";
import { StatusRepository } from "../repositories/StatusRepository";
import { Status } from "../entities/Status";

export class StatusData {
    constructor(
        public readonly open: Status,
        public readonly reopen: Status,
        public readonly todo: Status,
        public readonly detail: Status,
        public readonly assigned: Status,
        public readonly being: Status,
        public readonly selectedForIntervention: Status,
        public readonly waitingClient: Status,
        public readonly waitingAppointment: Status,
        public readonly waiting: Status,
        public readonly billing: Status,
        public readonly document: Status,
        public readonly test: Status,
        public readonly inTest: Status,
        public readonly inValidation: Status,
        public readonly resolved: Status,
        public readonly closed: Status,
        public readonly finish: Status,
        public readonly corrected: Status,
        public readonly noInterventionPlanned: Status,
        public readonly duplicate: Status,
        public readonly incomplete: Status,
        public readonly noReproduce: Status,
        public readonly over: Status
    ) {
    }

    @makecoffee
    public static *create(): IterableIterator<any> {
        return new StatusData(
            <Status>(yield new StatusRepository().findBySynchro("open")),
            <Status>(yield new StatusRepository().findBySynchro("reopen")),
            <Status>(yield new StatusRepository().findBySynchro("do")),
            <Status>(yield new StatusRepository().findBySynchro("detail")),
            <Status>(yield new StatusRepository().findBySynchro("assigned")),
            <Status>(yield new StatusRepository().findBySynchro("being")),
            <Status>(yield new StatusRepository().findBySynchro("selected_for_intervention")),
            <Status>(yield new StatusRepository().findBySynchro("waiting_client")),
            <Status>(yield new StatusRepository().findBySynchro("waiting_appointment")),
            <Status>(yield new StatusRepository().findBySynchro("waiting")),
            <Status>(yield new StatusRepository().findBySynchro("billing")),
            <Status>(yield new StatusRepository().findBySynchro("document")),
            <Status>(yield new StatusRepository().findBySynchro("test")),
            <Status>(yield new StatusRepository().findBySynchro("in_test")),
            <Status>(yield new StatusRepository().findBySynchro("in_validation")),
            <Status>(yield new StatusRepository().findBySynchro("resolved")),
            <Status>(yield new StatusRepository().findBySynchro("closed")),
            <Status>(yield new StatusRepository().findBySynchro("finish")),
            <Status>(yield new StatusRepository().findBySynchro("corrected")),
            <Status>(yield new StatusRepository().findBySynchro("no_intervention_planned")),
            <Status>(yield new StatusRepository().findBySynchro("duplicate")),
            <Status>(yield new StatusRepository().findBySynchro("incomplete")),
            <Status>(yield new StatusRepository().findBySynchro("no_reproduce")),
            <Status>(yield new StatusRepository().findBySynchro("over"))
        );
    }
}
