import { IGeneric } from "./IGeneric";
import { IRole } from "./IRole";
import { IEntity } from "./IEntity";

export interface IPermission extends IGeneric {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    role: IRole;
    entity: IEntity;
}
