package com.example.NFEspring.thread;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;

public class TenantThread extends Thread {

    private static ThreadLocal<Jws<Claims>> context = ThreadLocal.withInitial(() -> null);

    public static Jws<Claims> getThreadLocal() {
        return context.get();
    }

    public static void setThreadLocal(Jws<Claims> userId) {
        context.set(userId);
    }

    public static void clear() {
        context.remove();
    }

}
