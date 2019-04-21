import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Region } from "../entities/Region";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class RegionRepository extends ABaseRepository<Region> {
    constructor() {
        super("region");
    }

    @makecoffee
    public *create(region: Region): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "RegionRepository.create");
    }

    @makecoffee
    public *update(id: number, region: Region): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "RegionRepository.update");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "RegionRepository.delete");
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "RegionRepository.erase");
    }

    @makecoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where rg_id = ? 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <Region>{
            id: row[ "rg_id"],
            postal: row[ "rg_postal"],
            capital: row[ "rg_capital"],
            nccenr: row[ "rg_nccenr"],
            created: null,
            updated: null
        };
    }
}
