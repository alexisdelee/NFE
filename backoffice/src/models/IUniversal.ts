import { IQuery } from "./IQuery";

export interface IUniversal extends IQuery {
    category: string;
    label: string;
    defaultValue: string;
}
