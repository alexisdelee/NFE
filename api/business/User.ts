import { makeCoffee } from "../decorators/wrapper";
import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";

export abstract class AUser {
    public static artefact: symbol = Symbol();

    constructor(public user: User, protected dependOn: symbol) {
    }

    @makeCoffee
    public *update(): IterableIterator<any> {
        yield new UserRepository().update(this.user.id, this.user);
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
    public static artefact: symbol = Symbol();

    constructor(user: User, dependOn: symbol = Agent.artefact) {
        super(user, dependOn);
    }
}

export class Agent extends Anonymous {
    public static artefact: symbol = Symbol();

    constructor(user: User, dependOn: symbol = Operator.artefact) {
        super(user, dependOn);
    }
}

export class Operator extends Agent {
    public static artefact: symbol = Symbol();

    constructor(user: User, dependOn = Administrator.artefact) {
        super(user, dependOn);
    }
}

export class Administrator extends Operator {
    public static artefact: symbol = Symbol();

    constructor(user: User, dependOn = Root.artefact) {
        super(user, dependOn);
    }
}

export class Root extends Administrator {
    public static artefact: symbol = Symbol();

    constructor(user: User) {
        super(user);
    }
}
