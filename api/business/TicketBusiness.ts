import { makeCoffee } from "../decorators/wrapper";
import { TicketRepository } from "../repositories/TicketRepository";
import { Ticket } from "../entities/Ticket";
import { Region } from "../entities/Region";
import { Tracker } from "../entities/Tracker";
import { Priority } from "../entities/Priority";
import { Status } from "../entities/Status";
import { User } from "../entities/User";
import { HttpError, ClientError, ServerError } from "../utils/HttpWrapper";
import { Request } from "../utils/QueryWrapper";

export class TicketBusiness {
    public static readonly allowModifyResources: Array<string> = ["region", "tracker", "priority", "status"];

    constructor(public ticket: Ticket) {
    }

    @makeCoffee
    public *create(): IterableIterator<any> {
        return yield new TicketRepository().create(this.ticket);
    }

    @makeCoffee
    public *modifyResource<T extends Region | Tracker | Priority | Status>(item: T, resource: string): IterableIterator<any> {
        if (!TicketBusiness.allowModifyResources.includes(resource)) {
            throw new HttpError(ClientError.MethodNotAllowed, "thoses modifications are not allowed");
        }

        this.ticket[resource] = item;

        yield new TicketRepository().update(this.ticket.id, this.ticket);
    }

    @makeCoffee
    public *assignTo(user: User): IterableIterator<any> {
        this.ticket.assignee = user;

        yield new TicketRepository().update(this.ticket.id, this.ticket);
    }

    @makeCoffee
    public *disable(): IterableIterator<any> {
        yield new TicketRepository().delete(this.ticket.id);
    }

    @makeCoffee
    public static *findOne(ticketId: number): IterableIterator<any> {
        return yield new TicketRepository().findOne(ticketId, Request.FetchType.Eager);
    }

    @makeCoffee
    public static *findByResource(itemId: number, resource: string): IterableIterator<any> {
        try {
            return yield new TicketRepository().findOneByResource(itemId, resource, Request.FetchType.Eager);
        } catch(err) {
            if (err.code && err.code === ServerError.InternalServerError) {
                return new Array<Ticket>();
            }

            throw err;
        }
    }

    @makeCoffee
    public static *disable(ticketId: number): IterableIterator<any> {
        yield new TicketRepository().delete(ticketId);
    }
}
