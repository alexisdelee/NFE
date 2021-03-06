import { IQuery } from "./IQuery";
import { IRegion } from "./IRegion";
import { ITracker } from "./ITracker";
import { IPriority } from "./IPriority";
import { IStatus } from "./IStatus";
import { IUser } from "./IUser";
import { IAssignee } from "./IAssignee";
import { ILinkTicket } from "./ILinkTicket";
import { IItemData } from "./IItemData";

export interface ITicket extends IQuery {
    region: IRegion;
    summary: string;
    description: string;
    tracker: ITracker;
    priority: IPriority;
    status: IStatus;
    reporter: IUser;
    assignees: Array<IAssignee>;
    referents: Array<ILinkTicket>;
    references: Array<ILinkTicket>;
    data: Array<IItemData>;
    deleted: boolean;
    archived: boolean;
}
