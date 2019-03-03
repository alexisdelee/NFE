import { Query } from "./Query";

export class User extends Query {
    public id: number;
    public pseudo: string;
    public nfeid: string;
    public password: string;
    public salt: string;
    public iterations: number;
    public isDeleted: boolean;
}
