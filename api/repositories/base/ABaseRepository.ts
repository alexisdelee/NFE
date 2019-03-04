import { makecoffee } from "../../decorators/wrapper";
import { IWrite } from "../interfaces/IWrite";
import { IRead } from "../interfaces/IRead";
import { NotImplemented, InternalServerError } from "../../utils/HttpWrapper";
import { RowDataPacket, Query } from "../../utils/QueryWrapper";

import webconfig from "../../../webconfig";

import { Connection, createConnection, MysqlError, FieldInfo } from "mysql";

export abstract class ABaseRepository<T> implements IWrite<T>, IRead<T> {
    private static __shared_connection__: Connection;

    constructor(public readonly collection: string){
    }

    public abstract create(item: T): IterableIterator<any>;

    public abstract update(id: number, item: T): IterableIterator<any>;

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new NotImplemented("ABaseRepository<T>.delete");
    }

    public abstract erase(id: number): IterableIterator<any>;

    @makecoffee
    public *find(item: T): IterableIterator<any> {
        throw new NotImplemented("ABaseRepository<T>.find");
    }

    public abstract findOne(id: number): IterableIterator<any>;

    @makecoffee
    protected *query(options: string, values: Array<any> = []): IterableIterator<any> {
        return new Promise(function(resolve, reject) {
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

    @makecoffee
    protected *call(options: string, values: Array<any> = []): IterableIterator<any> {
        return new Promise(function(resolve, reject) {
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

    public abstract accessToSQL(row: RowDataPacket): IterableIterator<any>;

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
