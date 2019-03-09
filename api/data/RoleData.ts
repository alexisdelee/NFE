import { makecoffee } from "../decorators/wrapper";
import { RoleRepository } from "../repositories/RoleRepository";
import { Role } from "../entities/Role";

export class RoleData {
    constructor(
        public readonly anonymous: Role,
        public readonly agent: Role,
        public readonly operator: Role,
        public readonly administrator: Role,
        public readonly root: Role
    ) {
    }

    @makecoffee
    public static *create(): IterableIterator<any> {
        return new RoleData(
            <Role>(yield new RoleRepository().findBySynchro("anonymous")),
            <Role>(yield new RoleRepository().findBySynchro("agent")),
            <Role>(yield new RoleRepository().findBySynchro("operator")),
            <Role>(yield new RoleRepository().findBySynchro("administrator")),
            <Role>(yield new RoleRepository().findBySynchro("root"))
        );
    }
}
