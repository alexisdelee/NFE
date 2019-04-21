import { makeCoffee } from "../decorators/wrapper";
import { RoleRepository } from "../repositories/RoleRepository";
import { Role } from "../entities/Role";
import { Request } from "../utils/QueryWrapper";

export class RoleData {
    constructor(
        public readonly anonymous: Role,
        public readonly agent: Role,
        public readonly operator: Role,
        public readonly administrator: Role,
        public readonly root: Role
    ) {
    }

    @makeCoffee
    public static *create(): IterableIterator<any> {
        return new RoleData(
            <Role>(yield new RoleRepository().findBySynchro("anonymous", Request.FetchType.Eager)),
            <Role>(yield new RoleRepository().findBySynchro("agent", Request.FetchType.Eager)),
            <Role>(yield new RoleRepository().findBySynchro("operator", Request.FetchType.Eager)),
            <Role>(yield new RoleRepository().findBySynchro("administrator", Request.FetchType.Eager)),
            <Role>(yield new RoleRepository().findBySynchro("root", Request.FetchType.Eager))
        );
    }
}
