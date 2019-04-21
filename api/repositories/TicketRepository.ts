import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Ticket } from "../entities/Ticket";
import { Region } from "../entities/Region";
import { Tracker } from "../entities/Tracker";
import { Priority } from "../entities/Priority";
import { Status } from "../entities/Status";
import { Category } from "../entities/Category";
import { User } from "../entities/User";
import { RegionRepository } from "./RegionRepository";
import { TrackerRepository } from "./TrackerRepository";
import { PriorityRepository } from "./PriorityRepository";
import { StatusRepository } from "./StatusRepository";
import { CategoryRepository } from "./CategoryRepository";
import { UserRepository } from "./UserRepository";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class TicketRepository extends ABaseRepository<Ticket> {
    constructor() {
        super("ticket");
    }

    @makecoffee
    public *create(ticket: Ticket): IterableIterator<any> {
        yield this.call("create_ticket (?, ?, ?, ?, ?, ?, ?, ?)", [ ticket.summary, ticket.description, ticket.color, ticket.region.id, ticket.tracker.id, ticket.priority.id, ticket.status.id, ticket.assignee.id ]);
        return true;
    }

    @makecoffee
    public *update(id: number, ticket: Ticket): IterableIterator<any> { // work with assign_user_to_ticket
        yield this.query(`
            update ${this.collection} 
            set tk_region = ?, 
                tk_shortid = ?, 
                tk_summary = ?, 
                tk_description = compress (?), 
                tk_color = ?, 
                tk_tracker = ?, 
                tk_priority = ?, 
                tk_status = ?, 
                tk_category = ?, 
                tk_assignee = ?, 
                tk_reporter = ?, 
                tk_resolved = ? 
            where tk_id = ? 
                and tk_deleted = false 
        `, [ ticket.region.id, ticket.shortid, ticket.summary, ticket.description, ticket.color, ticket.tracker.id, ticket.priority.id, ticket.status.id, ticket.category.id, ticket.assignee.id, ticket.reporter.id, ticket.resolved, id ]);
        return true;
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        yield this.query(`
            update ${this.collection} 
            set tk_deleted = true 
            where tk_id = ? 
        `, [ id ]);
        return true;
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "TicketRepository.erase");
    }

    @makecoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select ${this.collection}.*, uncompress (${this.collection}.tk_description) as "tk_description" 
            from ${this.collection} 
            where tk_id = ? 
                and tk_deleted = false 
            limit 1
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {        
        return <Ticket>{
            id: row["tk_id"],
            shortid: row["tk_shortid"],
            summary: row["tk_summary"],
            description: row["tk_description"] === null ? null : row["tk_description"].toString("utf8"), // because of uncompress method, convert buffer to utf8
            created: row["tk_created"],
            updated: row["tk_updated"],
            resolved: row["tk_resolved"],
            region: yield this.fetch<RegionRepository, Region>(row["tk_region"], RegionRepository, fetchType), // yield new RegionRepository().findOne(row["tk_region"]),
            tracker: yield this.fetch<TrackerRepository, Tracker>(row["tk_tracker"], TrackerRepository, fetchType), // yield new TrackerRepository().findOne(row["tk_tracker"]),
            priority: yield this.fetch<PriorityRepository, Priority>(row["tk_priority"], PriorityRepository, fetchType),// yield new PriorityRepository().findOne(row["tk_priority"]),
            status: yield this.fetch<StatusRepository, Status>(row["tk_status"], StatusRepository, fetchType),// yield new StatusRepository().findOne(row["tk_status"]),
            category: yield this.fetch<CategoryRepository, Category>(row["tk_category"], CategoryRepository, fetchType),// yield new CategoryRepository().findOne(row["tk_category"]),
            assignee: yield this.fetch<UserRepository, User>(row["tk_assignee"], UserRepository, fetchType),// yield new UserRepository().findOne(row["tk_assignee"]),
            reporter: yield this.fetch<UserRepository, User>(row["tk_reporter"], UserRepository, fetchType) // yield new UserRepository().findOne(row["tk_reporter"])
        };
    }
}
