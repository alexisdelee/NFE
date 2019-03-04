import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Region } from "../entities/Region";
import { NotImplemented } from "../utils/HttpWrapper";
import { RowDataPacket, Query } from "../utils/QueryWrapper";

export class RegionRepository extends ABaseRepository<Region> {
    constructor() {
        super("region");
    }

    @makecoffee
    public *create(region: Region): IterableIterator<any> {
        throw new NotImplemented("RegionRepository.create");
    }

    @makecoffee
    public *update(id: number, region: Region): IterableIterator<any> {
        throw new NotImplemented("RegionRepository.update");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new NotImplemented("RegionRepository.delete");
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new NotImplemented("RegionRepository.erase");
    }

    @makecoffee
    public *findOne(id: number): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where rg_id = ? 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket): IterableIterator<any> {        
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
