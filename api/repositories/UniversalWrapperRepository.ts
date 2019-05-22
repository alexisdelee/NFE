import { makeCoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Universal } from "../entities/Universal";
import { Item } from "../entities/Item";
import { ItemData } from "../entities/ItemData";
import { ItemOption } from "../entities/ItemOption";
import { UniversalWrapper } from "../entities/UniversalWrapper";
import { Datatype } from "../utils/Utils";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class UniversalWrapperRepository extends ABaseRepository<UniversalWrapper> {
    constructor() {
        super(null);
    }

    @makeCoffee
    public *create(universal: UniversalWrapper): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "UniversalWrapperRepository.create");
    }

    @makeCoffee
    public *update(id: number, universal: UniversalWrapper): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "UniversalWrapperRepository.update");
    }

    @makeCoffee
    public *delete(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "UniversalWrapperRepository.delete");
    }

    @makeCoffee
    public *erase(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "UniversalWrapperRepository.erase");
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "UniversalWrapperRepository.findOne");
    }

    @makeCoffee
    public *findByTicket(ticketId: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {
        if (!ticketId) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where ul_id = ? 
            limit 1 
        `, [ ticketId ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {        
        return <UniversalWrapper>{
            id: row["ul_id"],
            category: row["ul_category"],
            label: row["ul_label"],
            created: null,
            updated: null
        };
    }
}
