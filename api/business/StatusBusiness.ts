import { makeCoffee } from "../decorators/wrapper";
import { StatusRepository } from "../repositories/StatusRepository";
import { Status } from "../entities/Status";
import { Request } from "../utils/QueryWrapper";

export class StatusBusiness {
    constructor(public status: Status) {
    }

    @makeCoffee
    public static *find(status: Status): IterableIterator<any> {
        return yield new StatusRepository().find(status, Request.FetchType.Eager);
    }

    @makeCoffee
    public static *findOne(statusId: number): IterableIterator<any> {
        return yield new StatusRepository().findOne(statusId, Request.FetchType.Eager);
    }
}
