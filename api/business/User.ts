import { makecoffee } from "../decorators/wrapper";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";

export abstract class AUser {
    constructor(public user: User) {
    }

    @makecoffee
    public *update(): IterableIterator<any> {
        yield new UserRepository().update(this.user.id, this.user);
    }
}

export class Anonymous extends AUser {
    constructor(user: User) {
        super(user);
    }
}

export class Agent extends Anonymous {
    constructor(user: User) {
        super(user);
    }
}

export class Operator extends Agent {
    constructor(user: User) {
        super(user);
    }
}

export class Administrator extends Operator {
    constructor(user: User) {
        super(user);
    }
}

export class Root extends Administrator {
    constructor(user: User) {
        super(user);
    }
}
