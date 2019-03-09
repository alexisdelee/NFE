import { Query } from "./Query";
import { Region } from "./Region";
import { Tracker } from "./Tracker";
import { Priority } from "./Priority";
import { Status } from "./Status";
import { Category } from "./Category";
import { User } from "./User";

export class Ticket extends Query {
    public region: Region;
    public shortid: number;
    public summary: string;
    public description: string;
    public color: string;
    public tracker: Tracker;
    public priority: Priority;
    public status: Status;
    public category: Category;
    public assignee: User;
    public reporter: User;
    public resolved: Date;
}
