package com.example.NFEspring.utils;

import com.google.gson.ExclusionStrategy;
import com.google.gson.FieldAttributes;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

import java.util.List;

public class DeserializableUtils {

    public static <T> T fromJsonToObject(String json, Class<T> cls) {
        return new Gson().fromJson(json, cls);
    }

    public static <T> T fromJsonToListObject(String json) {
        return new Gson().fromJson(json, new TypeToken<T>() {}.getType());
    }

    public static <T> T fromJsonToObjectWithExclusion(T object, List<String> fields, Class<T> cls) {
        Gson gson = new GsonBuilder()
                .addSerializationExclusionStrategy(new ExclusionStrategy() {
                    @Override
                    public boolean shouldSkipField(FieldAttributes fieldAttributes) {
                        return !fields.contains(
                                fieldAttributes.getName().toLowerCase()
                        );
                    }

                    @Override
                    public boolean shouldSkipClass(Class<?> aClass) {
                        return false;
                    }
                }).create();

        return DeserializableUtils.fromJsonToObject(
                gson.toJson(object),
                cls
        );
    }

}
