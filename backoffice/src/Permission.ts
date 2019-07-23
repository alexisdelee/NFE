import { IPermission } from "./models/IPermission";

export enum PermissionMethod {
    CREATE = "create",
    READ   = "read",
    UPDATE = "update",
    DELETE = "delete"
}

export class Permission {
    constructor(
        public readonly permissions: Array<IPermission>, 
        public readonly userId: number, 
        public readonly roleId: number
    ) { }

    public static parse(token: string): Permission {
        let permissions: Array<IPermission> = new Array<IPermission>();
        let userId: number, roleId: number;

        if (!!token) {
            const parts: any = token.split(".")
                .slice(0, 2)
                .map(part => atob(part))
                .map(part => JSON.parse(part));

            if (parts.length == 2) {
                const part: any = parts.pop();

                permissions = part.permissions;
                userId = part.userId;
                roleId = part.roleId;

            }
        }

        return new Permission(permissions, userId, roleId);
    }
    
    public static parseFromStorage(): Permission {
        return Permission.parse(
            sessionStorage.getItem("x-access-token")
        );
    }

    private _has(entity: string, method: PermissionMethod): boolean {
        const permission: IPermission = this.permissions.find(permission => permission.entity.label.substring(1) == entity);
        return permission && permission[method];
    }

    public has(entity: string | Array<string>, method: PermissionMethod | Array<PermissionMethod>): boolean {
        const entities: Array<string> = Array.isArray(entity) ? entity : [ entity ];
        const methods: Array<PermissionMethod> = Array.isArray(method) ? method : [ method ];

        for (const entity of entities) {
            for (const method of methods) {
                if (!this._has(entity, method)) {
                    return false;
                }
            }
        }

        return true;
    }
}
