import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Link } from "../entities/Link";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query } from "../utils/QueryWrapper";

export class LinkRepository extends ABaseRepository<Link> {
    constructor() {
        super("link");
    }

    @makecoffee
    public *create(link: Link): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "LinkRepository.create");
    }

    @makecoffee
    public *update(id: number, link: Link): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "LinkRepository.update");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "LinkRepository.delete");
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "LinkRepository.erase");
    }

    @makecoffee
    public *findOne(id: number): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where lk_id = ? 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket): IterableIterator<any> {        
        return <Link>{
            id: row["lk_id"],
            outward: row["lk_outward_description"],
            inward: row["lk_inward_description"],
            created: null,
            updated: null
        };
    }
}
