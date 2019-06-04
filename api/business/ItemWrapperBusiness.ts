import { makeCoffee } from "../decorators/wrapper";
import { TicketBusiness } from "../business/TicketBusiness";
import { ItemRepository } from "../repositories/ItemRepository";
import { ItemDataRepository } from "../repositories/ItemDataRepository";
import { ItemOptionRepository } from "../repositories/ItemOptionRepository";
import { Item } from "../entities/Item";
import { ItemData } from "../entities/ItemData";
import { ItemWrapper } from "../entities/ItemWrapper";
import { Ticket } from "../entities/Ticket";
import { Datatype } from "../utils/Utils";
import { Request } from "../utils/QueryWrapper";
import { HttpError, ClientError } from "../utils/HttpWrapper";

export class ItemWrapperBusiness {
    constructor(public wrapper: ItemWrapper) {
    }

    @makeCoffee
    private static *find(trackerId: number, ticketId: number): Datatype.Iterator.BiIterator<any> {
        const wrappers = new Array<ItemWrapper>();
        
        const items: Array<Item> = yield new ItemRepository().findByTracker(trackerId, Request.FetchType.Eager);
        for (const item of items) {
            const wrapper: ItemWrapper = <ItemWrapper>{
                item,
                options: yield new ItemOptionRepository().findByItem(item.id, Request.FetchType.Lazy),
                data: ticketId ? (yield new ItemDataRepository().find(<ItemData>{
                    item,
                    ticket: <Ticket>{ id: ticketId }
                }, Request.FetchType.Lazy)).shift() || null : null
            };

            wrappers.push(wrapper);
        }

        return wrappers;
    }

    @makeCoffee
    public static *findByTicket(ticketId: number): Datatype.Iterator.BiIterator<any> {
        const ticket: Ticket = yield TicketBusiness.findOne(ticketId);

        return yield this.find(ticket.tracker.id, ticket.id);
    }

    @makeCoffee
    public static *findByTracker(trackerId: number): Datatype.Iterator.BiIterator<any> {        
        return yield this.find(trackerId, null);
    }

    @makeCoffee
    public static *updateByTicket(wrapper: ItemWrapper): Datatype.Iterator.BiIterator<any> {
        if (wrapper.item.readonly) {
            throw new HttpError(ClientError.Forbidden, "");
        } else if (wrapper.item.required && [ null, undefined ].includes(wrapper.data.value)) {
            throw new HttpError(ClientError.Forbidden, "");
        } else {
            const ticket: Ticket = yield TicketBusiness.findOne(wrapper.data.ticket.id);
            if (ticket.archived) {
                throw new HttpError(ClientError.Forbidden, "");
            }
        }

        yield new ItemDataRepository().replace(wrapper.data);
    }
}
