import { makeCoffee } from "../decorators/wrapper";
import { IConstant } from "./interfaces/IConstant";
import { ABaseRepository } from "./base/ABaseRepository";
import { UserRepository } from "./UserRepository";
import { Preference } from "../entities/Preference";
import { User } from "../entities/User";
import { HttpError, ServerError } from "../utils/HttpWrapper";
import { RowDataPacket, Query, Request } from "../utils/QueryWrapper";

export class PreferenceRepository extends ABaseRepository<Preference> implements IConstant {
    constructor() {
        super("preference");
    }

    @makeCoffee
    public *create(preference: Preference): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PreferenceRepository.create");
    }

    @makeCoffee
    public *update(id: number, preference: Preference): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PreferenceRepository.update");
    }

    @makeCoffee
    public *erase(id: number): IterableIterator<any> {
        throw new HttpError(ServerError.NotImplemented, "PreferenceRepository.erase");
    }

    @makeCoffee
    public *findOne(id: number, fetchType: Request.FetchType): IterableIterator<any> {
        if (!id) {
            return null;
        }
        
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where pf_id = ? 
            limit 1 
        `, [ id ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *findBySynchro(label: string, fetchType: Request.FetchType): IterableIterator<any> {
        const query: Query = yield this.query(`
            select * 
            from ${this.collection} 
            where st_shortname = ? 
            limit 1 
        `, [ label ]);
        return this.accessToSQL(query.getOneRow(), fetchType);
    }

    @makeCoffee
    public *accessToSQL(row: RowDataPacket, fetchType: Request.FetchType): IterableIterator<any> {
        return <Preference>{
            id: row["pf_id"],
            user: yield this.fetch<UserRepository, User>(row["pf_user"], UserRepository, fetchType),
            key: row["pf_key"],
            value: row["pf_key"],
            created: null,
            updated: null
        };
    }
}
