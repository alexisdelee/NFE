package com.example.NFEspring.utils;

import com.example.NFEspring.entity.Permission;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

import java.util.ArrayList;

public class JwtUtils {

    @SuppressWarnings("unchecked")
    private static Object getValueFromBody(Object claims, String key) {
        return ((Jws<Claims>) claims).getBody().get(key);
    }

    public static ArrayList<Permission> getPermissions(Object claims) {
        Gson gson = new GsonBuilder().create();
        return gson.fromJson(
                SerializableUtils.toJson(
                        JwtUtils.getValueFromBody(claims, "permissions")
                ),
                new TypeToken<ArrayList<Permission>>(){}.getType()
        );
    }

    public static Integer getUserId(Object claims) {
        Gson gson = new GsonBuilder().create();
        return gson.fromJson(
                SerializableUtils.toJson(
                        JwtUtils.getValueFromBody(claims, "userId")
                ),
                new TypeToken<Integer>(){}.getType()
        );
    }

}
