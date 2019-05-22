import { makeCoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Universal } from "../entities/Universal";
import { Datatype } from "../utils/Utils";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class UniversalRepository extends ABaseRepository<Universal> {
    constructor() {
        super("universal");
    }

    @makeCoffee
    public *create(universal: Universal): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "UniversalRepository.create");
    }

    @makeCoffee
    public *update(id: number, universal: Universal): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "UniversalRepository.update");
    }

    @makeCoffee
    public *delete(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "UniversalRepository.delete");
    }

    @makeCoffee
    public *erase(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "UniversalRepository.erase");
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where ul_id = ? 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *findSpecificOne(universal: Universal): Datatype.Iterator.BiIterator<Query> {
        const query = yield this.query(`
            select *
            from ${this.collection}
            where ul_category = ?
                and ul_label = ?
        `, [ universal.category, universal.label ]);

        return this.accessToSQL(query.getOneRow(), Request.FetchType.Lazy);
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {        
        return <Universal>{
            id: row["ul_id"],
            category: row["ul_category"],
            label: row["ul_label"],
            created: null,
            updated: null
        };
    }
}
