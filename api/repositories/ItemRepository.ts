import { makeCoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { TrackerRepository } from "./TrackerRepository";
import { UniversalRepository } from "./UniversalRepository";
import { Item } from "../entities/Item";
import { Tracker } from "../entities/Tracker";
import { Universal } from "../entities/Universal";
import { Datatype } from "../utils/Utils";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class ItemRepository extends ABaseRepository<Item> {
    constructor() {
        super("item");
    }

    @makeCoffee
    public *create(item: Item): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ItemRepository.create");
    }

    @makeCoffee
    public *update(id: number, item: Item): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ItemRepository.update");
    }

    @makeCoffee
    public *delete(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ItemRepository.delete");
    }

    @makeCoffee
    public *erase(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ItemRepository.erase");
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where it_id = ? 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *findByTracker(trackerId: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<any> {
        const query = yield this.query(`
            select *
            from ${this.collection}
            where it_tracker = ?
        `, [ trackerId ]);
        const rows: Array<Item> = [];
        
        for (const row of query.getRows()) {
            rows.push(yield this.accessToSQL(row, fetchType));
        }

        return rows;
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {        
        return <Item>{
            id: row["it_id"],
            label: row["it_label"],
            readonly: row["it_readonly"],
            required: row["it_required"],
            tracker: yield this.fetch<TrackerRepository, Tracker>(row["it_tracker"], TrackerRepository, fetchType),
            universal: yield this.fetch<UniversalRepository, Universal>(row["it_universal"], UniversalRepository, fetchType),
            created: null,
            updated: null
        };
    }
}
