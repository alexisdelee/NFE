import { IQuery } from "./IQuery";
import { IResource } from "./IResource";
import { IRole } from "./IRole";

export interface IUser extends IQuery {
    pseudo: string;
    nfeid: string;
    avatar: IResource;
    role: IRole;
}
