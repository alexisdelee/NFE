import { makeCoffee } from "../decorators/wrapper";
import { StatusRepository } from "../repositories/StatusRepository";
import { Status } from "../entities/Status";
import { Request } from "../utils/QueryWrapper";

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

    @makeCoffee
    public static *create(): IterableIterator<any> {
        return new StatusData(
            <Status>(yield new StatusRepository().findBySynchro("open", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("reopen", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("do", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("detail", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("assigned", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("being", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("selected_for_intervention", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("waiting_client", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("waiting_appointment", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("waiting", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("billing", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("document", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("test", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("in_test", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("in_validation", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("resolved", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("closed", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("finish", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("corrected", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("no_intervention_planned", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("duplicate", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("incomplete", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("no_reproduce", Request.FetchType.Eager)),
            <Status>(yield new StatusRepository().findBySynchro("over", Request.FetchType.Eager))
        );
    }
}
