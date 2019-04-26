import { HttpError, ServerError } from "./HttpWrapper";

import { FieldInfo } from "mysql";

export class RowDataPacket {
}

export class Query {
    constructor(public readonly rows: Array<RowDataPacket>, public readonly fields: Array<FieldInfo>){
    }

    public getOneRow(): RowDataPacket {
        if (this.rows.length < 1) {            
            throw new HttpError(ServerError.InternalServerError, "no results are returned to be stored in this entity");
        }

        return this.rows[0];
    }
}

export namespace Request {
    export enum FetchType {
        // this does not load the relationships
        Lazy,
    
        // this loads all the relationships
        Eager
    }

    export enum Direction {
        ASC = "asc",
        DESC = "desc"
    }
}
