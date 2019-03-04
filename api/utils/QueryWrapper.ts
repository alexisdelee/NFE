import { InternalServerError } from "./HttpWrapper";
import { FieldInfo } from "mysql";

export class RowDataPacket {
}

export class Query {
    constructor(public rows: Array<RowDataPacket>, public fields: Array<FieldInfo>){
    }

    public getOneRow(): RowDataPacket {
        /* if (this.rows.length < 1) {
            throw new InternalServerError("no results are returned to be stored in this entity");
        } */

        return this.rows[0];
    }
}
