import * as uniqid from "uniqid";

import { makeCoffee } from "../decorators/wrapper";
import { PasswordCredential, TokenCredential } from "./Credential";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";
import * as Model from "../entities/Token";
import { Format } from "../utils/Utils";
import { HttpError, ServerError, ClientError } from "../utils/HttpWrapper";

export abstract class AUser {
    constructor(public user: User) {
    }

    @makeCoffee
    public *create(): IterableIterator<any> {
        const credential: PasswordCredential = new PasswordCredential();

        this.user.nfeid = uniqid();
        this.user.salt = PasswordCredential.getGeneratedSalt();
        this.user.iterations = credential.iterations;
        this.user.password = credential.store(this.user.password, this.user.salt);
        this.user.avatar = null; // to do

        return yield new UserRepository().create(this.user);
    }

    @makeCoffee
    static *sign(nfeid: string, password: string): IterableIterator<any> {
        try {
            const user: User = yield new UserRepository().findByNfeid(nfeid);

            if (PasswordCredential.verify(password, user.salt, user.password)) {
                return new TokenCredential().store(<Model.Token>{ userId: user.id, roleId: user.role.id }, 1, Format.Time.hour);
            } else {
                throw new HttpError(ClientError.NotFound, "no match for this password");
            }
        } catch(err) {
            if (err.code && err.code === ServerError.InternalServerError) {
                throw new HttpError(ClientError.NotFound, "no match for this nfeid");
            }

            throw err;
        }
    }
}

/**
 * Root
 *  |-- Administrator
 *      |-- Operator
 *          |-- Agent
 *              |-- Anonymous
 */

export class Anonymous extends AUser {
    constructor(user: User) {
        super(user);
        this.user.role = global.nfe.role.anonymous;
    }

    @makeCoffee
    public *create(): IterableIterator<any> {
        return yield super.create();
    }
}

// export class Agent extends Anonymous {
export class Agent extends AUser {
    constructor(user: User) {
        super(user);
        this.user.role = global.nfe.role.agent;
    }

    @makeCoffee
    public *create(): IterableIterator<any> {
        return yield super.create();
    }
}

// export class Operator extends Agent {
export class Operator extends AUser {
    constructor(user: User) {
        super(user);
        this.user.role = global.nfe.role.operator;
    }

    @makeCoffee
    public *create(): IterableIterator<any> {
        return yield super.create();
    }
}

// export class Administrator extends Operator {
export class Administrator extends AUser {
    constructor(user: User) {
        super(user);
        this.user.role = global.nfe.role.administrator;
    }

    @makeCoffee
    public *create(): IterableIterator<any> {
        return yield super.create();
    }
}

// export class Root extends Administrator {
export class Root extends AUser {
    constructor(user: User) {
        super(user);
        this.user.role = global.nfe.role.root;
    }

    @makeCoffee
    public *create(): IterableIterator<any> {
        return yield super.create();
    }
}
