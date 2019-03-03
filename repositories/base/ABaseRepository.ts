import { makecoffee } from "../../decorators/wrapper";
import { IWrite } from "../interfaces/IWrite";
import { IRead } from "../interfaces/IRead";

import webconfig from "../../webconfig";

import { Connection, createConnection, MysqlError, FieldInfo } from "mysql";

export abstract class ABaseRepository<T> implements IWrite<T>, IRead<T> {
    private static __shared_connection__: Connection;

    constructor(public readonly collection: string){
    }

    public abstract create(item: T): IterableIterator<any>;

    public abstract update(id: number, item: T): IterableIterator<any>;

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        throw new Error("not implemented");
    }

    public abstract erase(id: number): IterableIterator<any>;

    @makecoffee
    public *find(item: T): IterableIterator<any> {
        throw new Error("not implemented");
    }

    public abstract findOne(id: number): IterableIterator<any>;

    @makecoffee
    protected *query(options: string, values: Array<any> = []): IterableIterator<any> {
        return new Promise(function(resolve, reject) {
            ABaseRepository.getSharedConnection().query(options, values, function(err: MysqlError, rows: any, fields: Array<FieldInfo>) {
                try {
                    if (err) {
                        throw err;
                    }
    
                    resolve(rows);
                } catch(err) {
                    reject(err);
                }
            });
        });
    }

    @makecoffee
    protected *queryOne(options: string, values: Array<any> = []): IterableIterator<any> {
        const rows: any = yield this.query(options, values);
        if (rows.length != 1) {
            throw new Error("too many results are returned to be stored in this entity");
        }

        return rows[0];
    }

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
