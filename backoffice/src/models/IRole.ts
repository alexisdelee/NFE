import { IQuery } from "./IQuery";
import { IPermission } from "./IPermission";

export interface IRole extends IQuery {
    shortname: string;
    permissions: Array<IPermission>;
}
