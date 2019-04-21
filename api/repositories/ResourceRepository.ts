import { makeCoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Resource } from "../entities/Resource";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class ResourceRepository extends ABaseRepository<Resource> {
    constructor() {
        super("resource");
    }

    @makeCoffee
    public *create(resource: Resource): IterableIterator<any> {
        yield this.call("internal_create_resource (?, ?, ?)", [ resource.folder, resource.filename, resource.id ]);
        return true;
    }

    @makeCoffee
    public *update(id: number, resource: Resource): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "ResourceRepository.update");
    }

    @makeCoffee
    public *delete(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "ResourceRepository.delete");
    }

    @makeCoffee
    public *erase(id: number): IterableIterator<any> {
        yield this.query(`
            delete from ${this.collection} 
            where re_id = ? 
        `, [ id ]);
        return true;
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }

        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where re_id = ? 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <Resource>{
            id: row["re_id"],
            folder: row["re_folder"],
            filename: row["re_filename"],
            created: null,
            updated: null
        };
    }
}
