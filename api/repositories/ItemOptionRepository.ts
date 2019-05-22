import { makeCoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { ItemRepository } from "./ItemRepository";
import { ItemOption } from "../entities/ItemOption";
import { Item } from "../entities/Item";
import { Datatype } from "../utils/Utils";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class ItemOptionRepository extends ABaseRepository<ItemOption> {
    constructor() {
        super("item_option");
    }

    @makeCoffee
    public *create(option: ItemOption): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ItemOptionRepository.create");
    }

    @makeCoffee
    public *update(id: number, option: ItemOption): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ItemOptionRepository.update");
    }

    @makeCoffee
    public *delete(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ItemOptionRepository.delete");
    }

    @makeCoffee
    public *erase(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ItemOptionRepository.erase");
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where it_op_id = ? 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *findSpecificOne(option: ItemOption): Datatype.Iterator.BiIterator<Query> {
        const query = yield this.query(`
            select *
            from ${this.collection}
            where it_op_label = ?
            limit 1
        `, [ option.label ]);

        return this.accessToSQL(query.getOneRow(), Request.FetchType.Eager);
    }

    @makeCoffee
    public *findByItem(itemId: number, fetch: Request.FetchType): Datatype.Iterator.BiIterator<any> {
        const query = yield this.query(`
            select *
            from ${this.collection}
            where it_op_item = ?
        `, [ itemId ]);
        const rows: Array<ItemOption> = [];

        for (const row of query.getRows()) {
            rows.push(yield this.accessToSQL(row, fetch));
        }

        return rows;
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {        
        return <ItemOption>{
            id: row["it_op_id"],
            label: row["it_op_label"],
            value: row["it_op_value"],
            item: yield this.fetch<ItemRepository, Item>(row["it_op_item"], ItemRepository, fetchType),
            created: null,
            updated: null
        };
    }
}
