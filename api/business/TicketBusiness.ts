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
import { Datatype } from "../utils/Utils";

export class TicketBusiness {
    public static readonly allowModifyResources: Array<string> = ["region", "tracker", "priority", "status"];

    constructor(public ticket: Ticket) {
    }

    @makeCoffee
    public *create(): Datatype.Iterator.BiIterator<any> {
        /* const a = { ...this.ticket, ...{ reporter: "titi" } };
        console.log(a); */
        yield new TicketRepository().create(this.ticket);
    }

    @makeCoffee
    public *update(ticketId: number): Datatype.Iterator.BiIterator<any> {
        yield new TicketRepository().update(ticketId, this.ticket);
    }

    @makeCoffee
    public *modifyResource<T extends Region | Tracker | Priority | Status>(item: T, resource: string): Datatype.Iterator.BiIterator<any> {
        if (!TicketBusiness.allowModifyResources.includes(resource)) {
            throw new HttpError(ClientError.MethodNotAllowed, "thoses modifications are not allowed");
        }

        this.ticket[resource] = item;

        yield new TicketRepository().update(this.ticket.id, this.ticket);
    }

    @makeCoffee
    public *assignTo(user: User): Datatype.Iterator.BiIterator<any> {
        this.ticket.assignee = user;

        yield new TicketRepository().update(this.ticket.id, this.ticket);
    }

    @makeCoffee
    public static *findOne(ticketId: number): Datatype.Iterator.BiIterator<any> {
        return yield new TicketRepository().findOne(ticketId, Request.FetchType.Eager);
    }

    @makeCoffee
    public static *findByResource(itemId: number, resource: string): Datatype.Iterator.BiIterator<any> {
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
    public static *archive(ticketId: number): Datatype.Iterator.BiIterator<any> {
        yield new TicketRepository().archive(ticketId);
    }

    @makeCoffee
    public static *disable(ticketId: number): Datatype.Iterator.BiIterator<any> {
        yield new TicketRepository().delete(ticketId);
    }
}
