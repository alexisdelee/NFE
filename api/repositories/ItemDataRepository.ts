import { makeCoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { ItemRepository } from "./ItemRepository";
import { TicketRepository } from "./TicketRepository";
import { ItemData } from "../entities/ItemData";
import { Item } from "../entities/Item";
import { Ticket } from "../entities/Ticket";
import { Datatype } from "../utils/Utils";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class ItemDataRepository extends ABaseRepository<ItemData> {
    constructor() {
        super("item_data");
    }

    @makeCoffee
    public *create(data: ItemData): Datatype.Iterator.BiIterator<Query> {
        yield this.query(`
            insert into item_data (it_dt_value, it_dt_item, it_dt_ticket)
            values (?, ?, ?)
        `, [ data.value, data.item.id, data.ticket.id ]);
    }

    @makeCoffee
    public *update(id: number, data: ItemData): Datatype.Iterator.BiIterator<Query> {
        yield this.query(`
            update ${this.collection}
            set it_dt_value = ?
            where it_dt_id = ?
                and it_dt_deleted = false
        `, [ data.value, id ]);
    }

    @makeCoffee
    public *delete(id: number): Datatype.Iterator.BiIterator<Query> {
        yield this.query(`
            update ${this.collection}
            set it_dt_deleted = true
            where it_dt_id = ?
        `, [ id ]);
    }

    @makeCoffee
    public *erase(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ItemDataRepository.erase");
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where it_dt_id = ? 
                and it_dt_deleted = false
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *findByTicket(ticketId: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<any> {
        if (!ticketId) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where it_dt_ticket = ? 
                and it_dt_deleted = false
        `, [ ticketId ]);
        const rows: Array<ItemData> = [];
        
        for (const row of query.getRows()) {
            rows.push(yield this.accessToSQL(row, fetchType));
        }

        return rows;
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {        
        return <ItemData>{
            id: row["it_dt_id"],
            value: row["it_dt_value"],
            item: yield this.fetch<ItemRepository, Item>(row["it_dt_item"], ItemRepository, fetchType),
            ticket: yield this.fetch<TicketRepository, Ticket>(row["it_dt_ticket"], TicketRepository, fetchType),
            deleted: row["it_dt_deleted"],
            created: row["it_dt_created"],
            updated: row["it_dt_updated"]
        };
    }
}
