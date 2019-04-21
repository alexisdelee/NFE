import { makeCoffee } from "../decorators/wrapper";
import { ABaseRepository } from "./base/ABaseRepository";
import { User } from "../entities/User";
import { Resource } from "../entities/Resource";
import { Role } from "../entities/Role";
import { ResourceRepository } from "./ResourceRepository";
import { RoleRepository } from "./RoleRepository";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class UserRepository extends ABaseRepository<User> {
    constructor() {
        super("user");
    }

    @makeCoffee
    public *create(user: User): IterableIterator<any> {
        yield this.call("create_user (?, ?, ?, ?, ?, ?, ?, ?, ?)", [ user.pseudo, user.nfeid, user.password, user.salt, user.iterations, user.avatar.folder, user.avatar.filename, user.role.id, user.rgpd ]);
        return true;
    }

    @makeCoffee
    public *update(id: number, user: User): IterableIterator<any> {
        /* yield this.query(`
            update ${this.collection} 
            set usr_pseudo = ${user.pseudo}, 
                usr_nfeid = ${user.nfeid}, 
                usr_password = ${user.password}, 
                usr_salt = ${user.salt}, 
                usr_iterations = ${user.iterations} 
            where usr_id = ? 
                and usr_deleted = false 
        `, [ id ]); */
        throw new HttpError(ServerError.NotImplemented, "UserRepository.update");
    }

    @makeCoffee
    public *delete(id: number): IterableIterator<any> {
        yield this.query(`
            update ${this.collection} 
            set usr_deleted = true 
            where usr_id = ? 
        `, [ id ]);
        return true;
    }

    @makeCoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "UserRepository.erase");
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
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
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {
        return <User>{
            id: row["usr_id"],
            pseudo: row["usr_pseudo"],
            nfeid: row["usr_nfeid"],
            password: row["usr_password"],
            salt: row["usr_salt"],
            iterations: row["usr_iterations"],
            avatar: yield this.fetch<ResourceRepository, Resource>(row["usr_avatar"], ResourceRepository, fetchType), // yield new ResourceRepository().findOne(row["usr_avatar"]),
            role: yield this.fetch<RoleRepository, Role>(row["usr_role"], RoleRepository, fetchType), // yield new RoleRepository().findOne(row["usr_role"]),
            rgpd: Boolean(row["usr_rgpd"]),
            created: row["usr_created"],
            updated: row["usr_updated"]
        };
    }
}
