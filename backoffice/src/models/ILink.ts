import { IQuery } from "./IQuery";

export interface ILink extends IQuery {
    referentDescription: string;
    referenceDescription: string;
}
