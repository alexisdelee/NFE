import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Commentary } from "../entities/Commentary";
import { TicketRepository } from "./TicketRepository";
import { UserRepository } from "./UserRepository";
import { RoleRepository } from "./RoleRepository";
import { NotImplemented } from "../utils/HttpWrapper";
import { RowDataPacket, Query } from "../utils/QueryWrapper";

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
        throw new NotImplemented("CommentaryRepository.update");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        yield this.findOne(id);
        yield this.query(`
            update ${this.collection} 
            set cm_deleted = true 
            where cm_id = ?
        `, [ id ]);

        return true;
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new NotImplemented("CommentaryRepository.erase");
    }

    @makecoffee
    public *findOne(id: number): IterableIterator<any> {
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
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket): IterableIterator<any> {        
        return <Commentary>{
            id: row["cm_id"],
            description: row["cm_description"] === null ? null : row["cm_description"].toString("utf8"), // because of uncompress method, convert buffer to utf8
            ticket: yield new TicketRepository().findOne(row["cm_ticket"]),
            user: yield new UserRepository().findOne(row["cm_user"]),
            created: row["cm_created"],
            updated: row["cm_updated"]
        };
    }
}
