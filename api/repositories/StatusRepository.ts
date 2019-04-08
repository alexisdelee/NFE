import { makecoffee } from "../decorators/wrapper";
import { IConstant } from "./interfaces/IConstant";
import { ABaseRepository } from "./base/ABaseRepository";
import { CategoryRepository } from "./CategoryRepository";
import { Status } from "../entities/Status";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query } from "../utils/QueryWrapper";

export class StatusRepository extends ABaseRepository<Status> implements IConstant {
    constructor() {
        super("status");
    }

    @makecoffee
    public *create(status: Status): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "StatusRepository.create");
    }

    @makecoffee
    public *update(id: number, status: Status): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "StatusRepository.update");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "StatusRepository.delete");
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "StatusRepository.erase");
    }

    @makecoffee
    public *findOne(id: number): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where st_id = ? 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *findBySynchro(label: string): IterableIterator<any> {
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where st_shortname = ? 
            limit 1 
        `, [ label ]);
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket): IterableIterator<any> {
        return <Status>{
            id: row["st_id"],
            name: row["st_name"],
            shortname: row["st_shortname"],
            description: row["st_description"],
            category: yield new CategoryRepository().findOne(row["st_category"]),
            created: null,
            updated: null
        };
    }
}
