import { makeCoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { Ticket } from "../entities/Ticket";
import { Region } from "../entities/Region";
import { Tracker } from "../entities/Tracker";
import { Priority } from "../entities/Priority";
import { Status } from "../entities/Status";
import { User } from "../entities/User";
import { RegionRepository } from "./RegionRepository";
import { TrackerRepository } from "./TrackerRepository";
import { PriorityRepository } from "./PriorityRepository";
import { StatusRepository } from "./StatusRepository";
import { UserRepository } from "./UserRepository";
import { Datatype } from "../utils/Utils";
import { HttpError, ClientError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class TicketRepository extends ABaseRepository<Ticket> {
    constructor() {
        super("ticket");
    }

    @makeCoffee
    public *create(ticket: Ticket): Datatype.Iterator.BiIterator<Query> {
        yield this.call("create_ticket (?, ?, ?, ?, ?, ?, ?)", [
            ticket.summary,
            ticket.description,
            ticket.region.id,
            ticket.tracker.id,
            ticket.priority.id,
            ticket.status.id,
            ticket.assignee.id
        ]);
        return true;
    }

    @makeCoffee
    public *update(id: number, ticket: Ticket): Datatype.Iterator.BiIterator<Query> { // work with assign_user_to_ticket
        yield this.query(`
            update ${this.collection} 
            set tk_region = ?, 
                tk_summary = ?, 
                tk_description = compress (?), 
                tk_tracker = ?, 
                tk_priority = ?, 
                tk_status = ?,  
                tk_assignee = ?, 
                tk_reporter = ?, 
                tk_resolved = ? 
            where tk_id = ? 
                and tk_deleted = false 
        `, [
            ticket.region.id, 
            ticket.summary, 
            ticket.description, 
            ticket.tracker.id, 
            ticket.priority.id, 
            ticket.status.id,  
            ticket.assignee.id, 
            ticket.reporter.id, 
            ticket.resolved,
            id
        ]);
        return true;
    }

    @makeCoffee
    public *delete(id: number): Datatype.Iterator.BiIterator<Query> {
        yield this.query(`
            update ${this.collection} 
            set tk_deleted = true 
            where tk_id = ? 
        `, [ id ]);
        return true;
    }

    @makeCoffee
    public *erase(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "TicketRepository.erase");
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {
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

    @makeCoffee
    public *findOneByResource(id: number, resource: string, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<any> {
        let raw: string = `
            select ${this.collection}.*, uncompress (${this.collection}.tk_description) as "tk_description" 
            from ${this.collection} 
        `;

        const availableResources: Array<string> = ["region", "tracker", "priority", "status", "reporter", "assignee"];
        if (availableResources.includes(resource)) {
            raw += ` where tk_${resource} `;
        } else {
            throw new HttpError(ClientError.MethodNotAllowed, "thoses modifications are not allowed");
        }

        raw += id === null ? ` is not null ` : ` = ${id} `;
        
        const query: Query = yield this.query(raw, [ id ]);
        const rows: Array<Ticket> = [];
        
        for (const row of query.getRows()) {
            rows.push(yield this.accessToSQL(row, fetchType));
        }

        return rows;
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {        
        return <Ticket>{
            id: row["tk_id"],
            summary: row["tk_summary"],
            description: row["tk_description"] === null ? null : row["tk_description"].toString("utf8"), // because of uncompress method, convert buffer to utf8
            created: row["tk_created"],
            updated: row["tk_updated"],
            resolved: row["tk_resolved"],
            region: yield this.fetch<RegionRepository, Region>(row["tk_region"], RegionRepository, fetchType), // yield new RegionRepository().findOne(row["tk_region"]),
            tracker: yield this.fetch<TrackerRepository, Tracker>(row["tk_tracker"], TrackerRepository, fetchType), // yield new TrackerRepository().findOne(row["tk_tracker"]),
            priority: yield this.fetch<PriorityRepository, Priority>(row["tk_priority"], PriorityRepository, fetchType),// yield new PriorityRepository().findOne(row["tk_priority"]),
            status: yield this.fetch<StatusRepository, Status>(row["tk_status"], StatusRepository, fetchType),// yield new StatusRepository().findOne(row["tk_status"]),
            assignee: yield this.fetch<UserRepository, User>(row["tk_assignee"], UserRepository, fetchType),// yield new UserRepository().findOne(row["tk_assignee"]),
            reporter: yield this.fetch<UserRepository, User>(row["tk_reporter"], UserRepository, fetchType) // yield new UserRepository().findOne(row["tk_reporter"])
        };
    }
}
