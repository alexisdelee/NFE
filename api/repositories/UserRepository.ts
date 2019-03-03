import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { User } from "../entities/User";

export class UserRepository extends ABaseRepository<User> {
    constructor() {
        super("user");
    }

    @makecoffee
    public *create(user: User): IterableIterator<any> {
        yield this.queryOne("call create_user (?, ?, ?, ?, ?, null, null, 1, true)", [ user.pseudo, user.nfeid, user.password, user.salt, user.iterations ]);
        return true;
    }

    @makecoffee
    public *update(id: number, user: User): IterableIterator<any> {
        throw new Error("not implemented");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        const user: User = yield this.findOne(id);
        if (user.isDeleted) {
            return false;
        }

        yield this.queryOne("update " + this.collection + " set usr_deleted = true where usr_id = ?", [ id ]);
        return true;
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new Error("not implemented");
    }

    @makecoffee
    public *findOne(id: number): IterableIterator<any> {
        const row: any = yield this.queryOne("select * from " + this.collection + " where usr_id = ?", [ id ]);
        return <User>{
            id: row["usr_id"],
            pseudo: row["usr_pseudo"],
            nfeid: row["usr_nfeid"],
            password: row["usr_password"],
            salt: row["usr_salt"],
            iterations: row["usr_iterations"],
            isDeleted: row["usr_deleted"],
            created: row["usr_created"],
            updated: row["usr_updated"]
        };
    }
}
