import { makeCoffee } from "../decorators/wrapper";
import { IConstant } from "./interfaces/IConstant";
import { ABaseRepository } from "./base/ABaseRepository";
import { ResourceRepository } from "./ResourceRepository";
import { Priority } from "../entities/Priority";
import { Resource } from "../entities/Resource";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class PriorityRepository extends ABaseRepository<Priority> implements IConstant {
    constructor() {
        super("priority");
    }

    @makeCoffee
    public *create(priority: Priority): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PriorityRepository.create");
    }

    @makeCoffee
    public *update(id: number, priority: Priority): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PriorityRepository.update");
    }

    @makeCoffee
    public *delete(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PriorityRepository.delete");
    }

    @makeCoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PriorityRepository.erase");
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where pr_id = ? 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *findBySynchro(label: string, fetchType: Request.FetchType): IterableIterator<any> {
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where pr_shortname = ? 
            limit 1
        `, [ label ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <Priority>{
            id: row["pr_id"],
            name: row["pr_name"],
            shortname: row["pr_shortname"],
            description: row["pr_description"],
            icon: yield this.fetch<ResourceRepository, Resource>(row["pr_icon"], ResourceRepository, fetchType), // yield new ResourceRepository().findOne(row["pr_icon"]),
            created: null,
            updated: null
        };
    }
}
