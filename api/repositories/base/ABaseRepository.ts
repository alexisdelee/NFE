import { makeCoffee } from "../../decorators/wrapper";
import { IWrite } from "../interfaces/IWrite";
import { IRead } from "../interfaces/IRead";
import { Datatype } from "../../utils/Utils";
import { HttpError, ServerError } from "../../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../../utils/QueryWrapper";

import webconfig from "../../../webconfig";

import { Connection, createConnection, MysqlError, FieldInfo } from "mysql";

export abstract class ABaseRepository<T> implements IWrite<T>, IRead<T> {
    private static __shared_connection__: Connection;

    constructor(public readonly collection: string){
    }

    public abstract create(item: T): Datatype.Iterator.BiIterator<Query>;

    public abstract update(id: number, item: T): Datatype.Iterator.BiIterator<Query>;

    @makeCoffee
    public *delete(id: number): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ABaseRepository<T>.delete");
    }

    public abstract erase(id: number): Datatype.Iterator.BiIterator<Query>;

    @makeCoffee
    public *find(item: T, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query> {
        throw new HttpError(ServerError.NotImplemented, "ABaseRepository<T>.find");
    }

    public abstract findOne(id: number, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query>;

    @makeCoffee
    protected *query(options: string, values: Array<Datatype.Primitive | Date> = new Array()): Datatype.Iterator.Iterator<Query> {
        return new Promise<Query>(function(resolve, reject) {
            ABaseRepository.getSharedConnection().query(options, values, function(err: MysqlError, rows: Array<RowDataPacket>, fields: Array<FieldInfo>) {
                try {
                    if (err) {
                        throw err;
                    }
    
                    resolve(new Query(rows, fields));
                } catch(err) {
                    reject(err);
                }
            });
        });
    }

    @makeCoffee
    protected *call(options: string, values: Array<Datatype.Primitive | Date> = new Array()): Datatype.Iterator.Iterator<Query> {
        return new Promise<Query>(function(resolve, reject) {
            ABaseRepository.getSharedConnection().query("call " + options, values, function(err: MysqlError, rows: Array<any>, fields: Array<FieldInfo>) {
                try {
                    if (err) {
                        throw err;
                    }

                    resolve(new Query(rows[0], fields));
                } catch(err) {
                    reject(err);
                }
            });
        });
    }

    @makeCoffee
    protected *fetch<U extends ABaseRepository<V>, V>(id: number, type: { new(): U; }, fetchType: Request.FetchType): IterableIterator<any> {
        if (fetchType === Request.FetchType.Lazy) {
            // return yield id;
            return yield Datatype.SafeCast<U>({ id });
        } else if (fetchType === Request.FetchType.Eager) {
            return yield (new type()).findOne(id, fetchType);
        } else {
            throw new HttpError(ServerError.NotImplemented, "ABaseRepository<T>.fetch<U, V>");
        }
    }

    public abstract accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): Datatype.Iterator.BiIterator<Query>;

    private static getSharedConnection(): Connection {
        if(!ABaseRepository.__shared_connection__) {
            ABaseRepository.__shared_connection__ = createConnection({
                host: webconfig.database.host,
                user: webconfig.database.user,
                password: webconfig.database.password,
                database: webconfig.database.name
            });

            ABaseRepository.__shared_connection__.connect();
        }

        return ABaseRepository.__shared_connection__;
    }

    public static close(): void {
        if (ABaseRepository.__shared_connection__) {
            ABaseRepository.__shared_connection__.end();
            delete ABaseRepository.__shared_connection__;
        }
    }
}
