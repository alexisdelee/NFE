import { makecoffee } from "../decorators/wrapper";
import { IConstant } from "./interfaces/IConstant";
import { ABaseRepository } from "./base/ABaseRepository";
import { Role } from "../entities/Role";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class RoleRepository extends ABaseRepository<Role> implements IConstant {
    constructor() {
        super("role");
    }

    @makecoffee
    public *create(role: Role): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "RoleRepository.create");
    }

    @makecoffee
    public *update(id: number, role: Role): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "RoleRepository.update");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "RoleRepository.delete");
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "RoleRepository.erase");
    }

    @makecoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where ro_id = ? 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makecoffee
    public *findBySynchro(label: string, fetchType: Request.FetchType): IterableIterator<any> {
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where ro_shortname = ? 
            limit 1 
        `, [ label ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <Role>{
            id: row["ro_id"],
            shortname: row["ro_shortname"],
            created: null,
            updated: null
        };
    }
}
