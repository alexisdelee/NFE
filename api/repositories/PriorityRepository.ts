import { makecoffee } from "../decorators/wrapper";
import { IConstant } from "./interfaces/IConstant";
import { ABaseRepository } from "./base/ABaseRepository";
import { ResourceRepository } from "./ResourceRepository";
import { Priority } from "../entities/Priority";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query } from "../utils/QueryWrapper";

export class PriorityRepository extends ABaseRepository<Priority> implements IConstant {
    constructor() {
        super("priority");
    }

    @makecoffee
    public *create(priority: Priority): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PriorityRepository.create");
    }

    @makecoffee
    public *update(id: number, priority: Priority): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PriorityRepository.update");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PriorityRepository.delete");
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PriorityRepository.erase");
    }

    @makecoffee
    public *findOne(id: number): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where pr_id = ? 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *findBySynchro(label: string): IterableIterator<any> {
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where pr_shortname = ? 
            limit 1
        `, [ label ]);
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket): IterableIterator<any> {        
        return <Priority>{
            id: row["pr_id"],
            name: row["pr_name"],
            shortname: row["pr_shortname"],
            description: row["pr_description"],
            icon: yield new ResourceRepository().findOne(row["pr_icon"]),
            created: null,
            updated: null
        };
    }
}
