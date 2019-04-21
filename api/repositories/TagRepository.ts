import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Tag } from "../entities/Tag";
import { Ticket } from "../entities/Ticket";
import { User } from "../entities/User";
import { TicketRepository } from "./TicketRepository";
import { UserRepository } from "./UserRepository";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class TagRepository extends ABaseRepository<Tag> {
    constructor() {
        super("tag");
    }

    @makecoffee
    public *create(tag: Tag): IterableIterator<any> {
        yield this.call("assign_tag_to_ticket (?, ?, ?, ?)", [ tag.name, tag.private, tag.ticket.id, tag.user.id ]);
        return true;
    }

    @makecoffee
    public *update(id: number, tag: Tag): IterableIterator<any> { // work with assign_tag_to_ticket 
        yield this.query(`
            update ${this.collection} 
            set tg_name = ?, 
                tg_private = ?, 
                tg_ticket = ?, 
                tg_user = ? 
            where tg_id = ? 
                and tg_deleted = false 
                and ( 
                    tg_private = false 
                    or ( 
                        tg_private = true 
                        and tg_user = ? 
                    )
                ) 
        `, [ tag.name, tag.private, tag.ticket.id, tag.user.id, id ]);
        return true;
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        yield this.query(`
            update ${this.collection} 
            set tg_deleted = true 
            where tg_id = ? 
                and ( 
                    tg_private = false 
                    or ( 
                        tg_private = true 
                        and tg_user = ? 
                    )
                ) 
        `, [ id, id ]);
        return true;
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "TagRepository.erase");
    }

    @makecoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where tg_id = ? 
                and tg_deleted = false 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <Tag>{
            id: row["tg_id"],
            name: row["tg_name"],
            private: Boolean(row["tg_private"]),
            ticket: yield this.fetch<TicketRepository, Ticket>(row["tg_ticket"], TicketRepository, fetchType), // yield new TicketRepository().findOne(row["tg_ticket"]),
            user: yield this.fetch<UserRepository, User>(row["tg_user"], UserRepository, fetchType), // yield new UserRepository().findOne(row["tg_user"]),
            created: row["cm_created"],
            updated: row["cm_updated"]
        };
    }
}
