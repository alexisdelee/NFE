import { IQuery } from "./IQuery";
import { IResource } from "./IResource";
import { IRole } from "./IRole";

export interface IUser extends IQuery {
    pseudo: string;
    nfeid: string;
    password: string;
    salt: string;
    iterations: number;
    avatar: IResource;
    role: IRole;
}
