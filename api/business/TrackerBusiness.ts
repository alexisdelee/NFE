import { makeCoffee } from "../decorators/wrapper";
import { TrackerRepository } from "../repositories/TrackerRepository";
import { Tracker } from "../entities/Tracker";
import { Request } from "../utils/QueryWrapper";

export class TrackerBusiness {
    constructor(public tracker: Tracker) {
    }

    @makeCoffee
    public static *find(tracker: Tracker): IterableIterator<any> {
        return yield new TrackerRepository().find(tracker, Request.FetchType.Eager);
    }

    @makeCoffee
    public static *findOne(trackerId: number): IterableIterator<any> {
        return yield new TrackerRepository().findOne(trackerId, Request.FetchType.Eager);
    }
}
