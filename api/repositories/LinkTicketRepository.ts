import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { LinkRepository } from "./LinkRepository";
import { LinkTicket } from "../entities/LinkTicket";
import { Link } from "../entities/Link";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class LinkTicketRepository extends ABaseRepository<LinkTicket> {
    constructor() {
        super("link_ticket");
    }

    @makecoffee
    public *create(linkTicket: LinkTicket): IterableIterator<any> {
        yield this.call("assign_link_to_ticket (?, ?, ?)", [ linkTicket.link.id, linkTicket.outward.id, linkTicket.inward.id ]);
        return true;
    }

    @makecoffee
    public *update(id: number, linkTicket: LinkTicket): IterableIterator<any> { // work with assign_link_to_ticket
        yield this.query(`
            update ${this.collection} 
            set lk_tk_link = ?, 
                lk_tk_outward_ticket = ?, 
                lk_tk_inward_ticket = ? 
            where lk_tk_id = ? 
        `, [ linkTicket.link.id, linkTicket.outward.id, linkTicket.inward.id, id ]);
        return true;
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "LinkTicketRepository.delete");
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        yield this.query(`
            delete from ${this.collection} 
            where lk_tk_id = ?
        `, [ id ]);

        return true;
    }

    @makecoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where lk_tk_id = ? 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <LinkTicket>{
            id: row["lk_tk_id"],
            link: yield this.fetch<LinkRepository, Link>(row["lk_tk_link"], LinkRepository, fetchType), // yield new LinkRepository().findOne(row["lk_tk_link"]),
            outward: yield this.fetch<LinkRepository, Link>(row["lk_tk_outward_ticket"], LinkRepository, fetchType), // yield new TicketRepository().findOne(row["lk_tk_outward_ticket"]),
            inward: yield this.fetch<LinkRepository, Link>(row["lk_tk_inward_ticket"], LinkRepository, fetchType), // yield new TicketRepository().findOne(row["lk_tk_inward_ticket"]),
            created: row["lk_tk_created"],
            updated: row["lk_tk_updated"]
        };
    }
}
