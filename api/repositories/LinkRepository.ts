import { makeCoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Link } from "../entities/Link";
import { Datatype } from "../utils/Utils";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class LinkRepository extends ABaseRepository<Link> {
    constructor() {
        super("link");
    }

    @makeCoffee
    public *create(link: Link): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "LinkRepository.create");
    }

    @makeCoffee
    public *update(id: number, link: Link): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "LinkRepository.update");
    }

    @makeCoffee
    public *delete(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "LinkRepository.delete");
    }

    @makeCoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "LinkRepository.erase");
    }

    @makeCoffee
    public *find(item: Link, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<any> {
        if (!item) {
            item = new Link();
        }

        const query: Query = yield this.call("get_links(?, ?)", [ item.outward, item.inward ]);

        const rows: Array<Link> = [];
        for (const row of query.getRows()) {
            rows.push(yield this.accessToSQL(row, fetchType));
        }

        return rows;
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where lk_id = ? 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <Link>{
            id: row["lk_id"],
            outward: row["lk_outward_description"],
            inward: row["lk_inward_description"],
            created: null,
            updated: null
        };
    }
}
