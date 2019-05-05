import { makeCoffee } from "../decorators/wrapper";
import { IConstant } from "./interfaces/IConstant";
import { ABaseRepository } from "./base/ABaseRepository";
import { Category } from "../entities/Category";
import { Datatype } from "../utils/Utils";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class CategoryRepository extends ABaseRepository<Category> implements IConstant {
    constructor() {
        super("category");
    }

    @makeCoffee
    public *create(category: Category): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "CategoryRepository.create");
    }

    @makeCoffee
    public *update(id: number, category: Category): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "CategoryRepository.update");
    }

    @makeCoffee
    public *delete(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "CategoryRepository.delete");
    }

    @makeCoffee
    public *erase(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "CategoryRepository.erase");
    }

    @makeCoffee
    public *find(item: Category, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<any> {
        if (!item) {
            item = new Category();
        }

        const query: Query = yield this.call("get_categories(?, ?)", [ item.name, item.shortname ]);

        const rows: Array<Category> = [];
        for (const row of query.getRows()) {
            rows.push(yield this.accessToSQL(row, fetchType));
        }

        return rows;
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where ca_id = ? 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *findBySynchro(label: string, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where ca_shortname = ?
            limit 1
        `, [ label ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {            
        return <Category>{
            id: row["ca_id"],
            name: row["ca_name"],
            shortname: row["ca_shortname"],
            created: null,
            updated: null
        };
    }
}
