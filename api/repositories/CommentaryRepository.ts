import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Commentary } from "../entities/Commentary";
import { Ticket } from "../entities/Ticket";
import { User } from "../entities/User";
import { TicketRepository } from "./TicketRepository";
import { UserRepository } from "./UserRepository";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class CommentaryRepository extends ABaseRepository<Commentary> {
    constructor() {
        super("commentary");
    }

    @makecoffee
    public *create(commentary: Commentary): IterableIterator<any> {
        yield this.call("assign_commentary_to_ticket (?, ?, ?)", [ commentary.description, commentary.ticket.id, commentary.user.id ]);
        return true;
    }

    @makecoffee
    public *update(id: number, commentary: Commentary): IterableIterator<any> {
        yield this.query(`
            update ${this.collection} 
            set cm_description = compress (?), 
                cm_ticket = ?, 
                cm_user = ? 
            where cm_id = ? 
                and cm_deleted = false 
        `, [ commentary.description, commentary.ticket.id, commentary.user.id, id ]);
        return true;
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        yield this.query(`
            update ${this.collection} 
            set cm_deleted = true 
            where cm_id = ?
        `, [ id ]);
        return true;
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "CommentaryRepository.erase");
    }

    @makecoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select ${this.collection}.*, uncompress (${this.collection}.cm_description) as "cm_description"
            from ${this.collection} 
            where cm_id = ? 
                and cm_deleted = false 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <Commentary>{
            id: row["cm_id"],
            description: row["cm_description"] === null ? null : row["cm_description"].toString("utf8"), // because of uncompress method, convert buffer to utf8
            ticket: yield this.fetch<TicketRepository, Ticket>(row["cm_ticket"], TicketRepository, fetchType), // fetchType === Request.FetchType.Lazy ? row["cm_ticket"] : yield new TicketRepository().findOne(row["cm_ticket"]),
            user: yield this.fetch<UserRepository, User>(row["cm_user"], UserRepository, fetchType), // yield new UserRepository().findOne(row["cm_user"]),
            created: row["cm_created"],
            updated: row["cm_updated"]
        };
    }
}
