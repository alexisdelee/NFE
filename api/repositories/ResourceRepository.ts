import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Resource } from "../entities/Resource";
import { NotImplemented } from "../utils/HttpWrapper";
import { RowDataPacket, Query } from "../utils/QueryWrapper";

export class ResourceRepository extends ABaseRepository<Resource> {
    constructor() {
        super("resource");
    }

    @makecoffee
    public *create(resource: Resource): IterableIterator<any> {
        yield this.call("internal_create_resource (?, ?, ?)", [ resource.folder, resource.filename, resource.id ]);
        return true;
    }

    @makecoffee
    public *update(id: number, resource: Resource): IterableIterator<any> {
        throw new NotImplemented("ResourceRepository.update");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new NotImplemented("ResourceRepository.delete");
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        yield this.query(`
            delete from ${this.collection} 
            where re_id = ? 
        `, [ id ]);
        return true;
    }

    @makecoffee
    public *findOne(id: number): IterableIterator<any> {
        if (!id) {
            return null;
        }

        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where re_id = ? 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket): IterableIterator<any> {        
        return <Resource>{
            id: row["re_id"],
            folder: row["re_folder"],
            filename: row["re_filename"],
            created: null,
            updated: null
        };
    }
}
