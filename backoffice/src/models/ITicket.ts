import { IQuery } from "./IQuery";
import { IRegion } from "./IRegion";
import { ITracker } from "./ITracker";
import { IPriority } from "./IPriority";
import { IStatus } from "./IStatus";
import { IUser } from "./IUser";

export interface ITicket extends IQuery {
    region: IRegion;
    shortid: number;
    summary: string;
    description: string;
    color: string;
    tracker: ITracker;
    priority: IPriority;
    status: IStatus;
    assignee: IUser;
    reporter: IUser;
    resolved: Date;
}
