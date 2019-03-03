import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { User } from "../entities/User";

import { MysqlError, FieldInfo } from "mysql";

export class UserRepository extends ABaseRepository<User> {
    constructor() {
        super("user");
    }

    @makecoffee
    public *create(user: User): IterableIterator<Promise<boolean>> {
        return Promise.resolve(false);
    }

    @makecoffee
    public *update(id: number, user: User): IterableIterator<Promise<boolean>> {
        return Promise.resolve(false);
    }

    @makecoffee
    public *erase(id: number): IterableIterator<Promise<boolean>> {
        return Promise.resolve(false);
    }

    @makecoffee
    public *findOne(id: number): IterableIterator<Promise<User>> {
        const self = this;

        return new Promise(function(resolve, reject) {
            ABaseRepository.getSharedConnection().query("select * from " + self.collection + " where usr_id = ?", [ id ], function(err: MysqlError, rows: any, fields: Array<FieldInfo>) {
                try {
                    if (err) {
                        throw err;
                    } else if (rows.length != 1) {
                        throw new Error("too many results are returned to be stored in this entity");
                    }
    
                    resolve(<User>{
                        id: rows[0]["usr_id"],
                        pseudo: rows[0]["usr_pseudo"],
                        nfeid: rows[0]["usr_nfeid"],
                        password: rows[0]["usr_password"],
                        salt: rows[0]["usr_salt"],
                        iterations: rows[0]["usr_iterations"]
                    });
                } catch(err) {
                    reject(err);
                }
            });
        });
    }
}
