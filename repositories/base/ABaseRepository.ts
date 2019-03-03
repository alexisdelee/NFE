import { makecoffee } from "../../decorators/wrapper";
import { IWrite } from "../interfaces/IWrite";
import { IRead } from "../interfaces/IRead";

import webconfig from "../../webconfig";

import { Connection, createConnection } from "mysql";

export abstract class ABaseRepository<T> implements IWrite<T>, IRead<T> {
    private static __shared_connection__: Connection;

    constructor(public readonly collection: string){
    }

    public abstract create(item: T): IterableIterator<Promise<boolean>>;

    public abstract update(id: number, item: T): IterableIterator<Promise<boolean>>;

    @makecoffee
    public *delete(id: number): IterableIterator<Promise<boolean>> {
        throw new Error("not implemented");
    }

    public abstract erase(id: number): IterableIterator<Promise<boolean>>;

    @makecoffee
    public *find(item: T): IterableIterator<Promise<T>> {
        throw new Error("not implemented");
    }

    public abstract findOne(id: number): IterableIterator<Promise<T>>;

    public static getSharedConnection(): Connection {
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
