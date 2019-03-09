export abstract class AUser {
    constructor() {
        // do something
    }
}

export class Anonymous extends AUser {
    constructor() {
        super();
    }
}

export class Agent extends Anonymous {
    constructor() {
        super();
    }
}

export class Operator extends Agent {
    constructor() {
        super();
    }
}

export class Administrator extends Operator {
    constructor() {
        super();
    }
}

export class Root extends Administrator {
    constructor() {
        super();
    }
}
