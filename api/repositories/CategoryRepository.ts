import { makecoffee } from "../decorators/wrapper";
import { IConstant } from "./interfaces/IConstant";
import { ABaseRepository } from "./base/ABaseRepository";
import { Category } from "../entities/Category";
import { Datatype } from "../utils/Utils";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query } from "../utils/QueryWrapper";

export class CategoryRepository extends ABaseRepository<Category> implements IConstant {
    constructor() {
        super("category");
    }

    @makecoffee
    public *create(category: Category): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "CategoryRepository.create");
    }

    @makecoffee
    public *update(id: number, category: Category): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "CategoryRepository.update");
    }

    @makecoffee
    public *delete(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "CategoryRepository.delete");
    }

    @makecoffee
    public *erase(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "CategoryRepository.erase");
    }

    @makecoffee
    public *findOne(id: number): Datatype.Iterator.BiIterator<Query> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where ca_id = ? 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *findBySynchro(label: string): Datatype.Iterator.BiIterator<Query> {
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where ca_shortname = ?
            limit 1
        `, [ label ]);
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket): Datatype.Iterator.BiIterator<Query> {        
        return <Category>{
            id: row["ca_id"],
            name: row["ca_name"],
            shortname: row["ca_shortname"],
            created: null,
            updated: null
        };
    }
}
