import { makecoffee } from "../decorators/wrapper";
import { IConstant } from "./interfaces/IConstant";
import { ABaseRepository } from "./base/ABaseRepository";
import { ResourceRepository } from "./ResourceRepository";
import { Tracker } from "../entities/Tracker";
import { Resource } from "../entities/Resource";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class TrackerRepository extends ABaseRepository<Tracker> implements IConstant {
    constructor() {
        super("tracker");
    }

    @makecoffee
    public *create(tracker: Tracker): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "TrackerRepository.create");
    }

    @makecoffee
    public *update(id: number, tracker: Tracker): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "TrackerRepository.update");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "TrackerRepository.delete");
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "TrackerRepository.erase");
    }

    @makecoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where tr_id = ? 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makecoffee
    public *findBySynchro(label: string, fetchType: Request.FetchType): IterableIterator<any> {
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where tr_shortname = ? 
            limit 1 
        `, [ label ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <Tracker>{
            id: row["tr_id"],
            name: row["tr_name"],
            shortname: row["tr_shortname"],
            description: row["tr_description"],
            icon: yield this.fetch<ResourceRepository, Resource>(row["tr_icon"], ResourceRepository, fetchType), // yield new ResourceRepository().findOne(row["tr_icon"]),
            created: null,
            updated: null
        };
    }
}
