import { Query } from "./Query";
import { Region } from "./Region";
import { Tracker } from "./Tracker";
import { Priority } from "./Priority";
import { Status } from "./Status";
import { User } from "./User";

export class Ticket extends Query {
    public region: Region;
    public summary: string;
    public description: string;
    public tracker: Tracker;
    public priority: Priority;
    public status: Status;
    public assignee: User;
    public reporter: User;
    public resolved: Date;
}
