import { IQuery } from "./IQuery";

export interface IResource extends IQuery {
    folder: string;
    filename: string;
}
