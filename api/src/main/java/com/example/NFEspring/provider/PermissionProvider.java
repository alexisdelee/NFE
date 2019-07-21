package com.example.NFEspring.provider;

import com.example.NFEspring.entity.Permission;
import javassist.NotFoundException;

public class PermissionProvider {

    public static boolean isAccessible(Permission permission, String method) throws NotFoundException {
        switch (method.toLowerCase()) {
            case "post":
                return permission.isCreate();
            case "get":
                return permission.isRead();
            case "put":
            case "patch":
                return permission.isUpdate();
            case "delete":
                return permission.isDelete();
            default:
                throw new NotFoundException("method not found");
        }
    }

}
