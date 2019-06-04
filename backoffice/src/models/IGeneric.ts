import { IQuery } from "./IQuery";

export interface IGeneric extends IQuery {
    name: string;
    shortname: string;
    description: string;
}
