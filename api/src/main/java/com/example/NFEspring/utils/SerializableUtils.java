package com.example.NFEspring.utils;

import com.google.gson.Gson;

import java.util.*;
import java.util.stream.Collectors;

public class SerializableUtils {

    public static <T> Map<String, T> singletonMap(String key, T value) {
        return Collections.singletonMap(key, value);
    }

    public static Map<String, ?> emptyMap() {
        return new HashMap<>();
    }

    public static Map<String, Object> map(Map<String, Object>... parameters) {
        return Arrays.stream(parameters).map(parameter -> {
            Optional<Map.Entry<String, Object>> p = parameter.entrySet().stream().findFirst();
            return new AbstractMap.SimpleImmutableEntry<>(p.orElseThrow().getKey(), p.orElseThrow().getValue()) {};
        }).collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    public static String toJson(Object object) {
        return new Gson().toJson(object);
    }

}
