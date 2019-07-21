package com.example.NFEspring.provider;

import com.example.NFEspring.DemoApplication;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtBuilder;
import io.jsonwebtoken.Jwts;

import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.Optional;

public class AuthenticationProvider {

    public static Optional<Jws<Claims>> identifyProvider(String token) {
        try {
            Jws<Claims> claims = Jwts.parser().setSigningKey(DemoApplication.key).parseClaimsJws(token);
            return Optional.of(claims);
        } catch (Exception exception) {
            return Optional.empty();
        }
    }

    public static String getToken(Map<String, Object> claims, boolean unlimited) {
        JwtBuilder jwtBuilder = Jwts
                .builder()
                .signWith(DemoApplication.key)
                .setClaims(claims);

        if (!unlimited) {
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(new Date());
            calendar.add(Calendar.HOUR_OF_DAY, 2); // expire after 2h

            jwtBuilder.setExpiration(calendar.getTime());
        }

        return jwtBuilder.compact();
    }

    public static String getToken(Map<String, Object> claims) {
        return AuthenticationProvider.getToken(claims, false);
    }

}
