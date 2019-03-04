import { makecoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { User } from "../entities/User";
import { ResourceRepository } from "./ResourceRepository";
import { RoleRepository } from "./RoleRepository";
import { NotImplemented } from "../utils/HttpWrapper";
import { RowDataPacket, Query } from "../utils/QueryWrapper";

export class UserRepository extends ABaseRepository<User> {
    constructor() {
        super("user");
    }

    @makecoffee
    public *create(user: User): IterableIterator<any> {
        yield this.call("create_user (?, ?, ?, ?, ?, ?, ?, ?, ?)", [ user.pseudo, user.nfeid, user.password, user.salt, user.iterations, user.avatar.folder, user.avatar.filename, user.role.id, user.rgpd ]);
        return true;
    }

    @makecoffee
    public *update(id: number, user: User): IterableIterator<any> {
        throw new NotImplemented("UserRepository.update");
    }

    @makecoffee
    public *delete(id: number): IterableIterator<any> {
        yield this.query(`
            update ${this.collection} 
            set usr_deleted = true 
            where usr_id = ? 
        `, [ id ]);
        return true;
    }

    @makecoffee
    public *erase(id: number): IterableIterator<any> {
        throw new NotImplemented("UserRepository.erase");
    }

    @makecoffee
    public *findOne(id: number): IterableIterator<any> {
        if (!id) {
            return null;
        }

        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where usr_id = ? 
                and usr_deleted = false 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow());
    }

    @makecoffee
    public *accessToSQL(row: RowDataPacket): IterableIterator<any> {
        return <User>{
            id: row["usr_id"],
            pseudo: row["usr_pseudo"],
            nfeid: row["usr_nfeid"],
            password: row["usr_password"],
            salt: row["usr_salt"],
            iterations: row["usr_iterations"],
            avatar: yield new ResourceRepository().findOne(row["usr_avatar"]),
            role: yield new RoleRepository().findOne(row["usr_role"]),
            rgpd: Boolean(row["usr_rgpd"]),
            created: row["usr_created"],
            updated: row["usr_updated"]
        };
    }
}
