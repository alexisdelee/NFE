import { makeCoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Region } from "../entities/Region";
import { Datatype } from "../utils/Utils";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class RegionRepository extends ABaseRepository<Region> {
    constructor() {
        super("region");
    }

    @makeCoffee
    public *create(region: Region): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "RegionRepository.create");
    }

    @makeCoffee
    public *update(id: number, region: Region): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "RegionRepository.update");
    }

    @makeCoffee
    public *delete(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "RegionRepository.delete");
    }

    @makeCoffee
    public *erase(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "RegionRepository.erase");
    }

    @makeCoffee
    public *find(item: Region, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<any> {
        if (!item) {
            item = new Region();
        }

        const query: Query = yield this.call("get_regions(?, ?, ?)", [ item.postal, item.capital, item.name ]);

        const rows: Array<Region> = [];
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
            where rg_id = ? 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <Region>{
            id: row[ "rg_id"],
            postal: row[ "rg_postal"],
            capital: row[ "rg_capital"],
            name: row[ "rg_name"],
            created: null,
            updated: null
        };
    }
}
