package com.example.NFEspring.middleware;

import com.example.NFEspring.provider.AuthenticationProvider;
import com.example.NFEspring.thread.TenantThread;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;
import com.example.NFEspring.utils.SerializableUtils;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.AccessDeniedException;

public class JWTAuthenticationFilter extends OncePerRequestFilter implements Filter {

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        try {
            String token = request.getParameter("x-access-token") != null
                    ? request.getParameter("x-access-token")
                    : request.getHeader("x-access-token");
            Jws<Claims> claims = AuthenticationProvider
                    .identifyProvider(token)
                    .orElseThrow(() -> new AccessDeniedException("Forbidden: access denied"));

            request.setAttribute("token", token);
            request.setAttribute("claims", claims);

            // debug
            TenantThread.setThreadLocal(claims);
            // debug

            filterChain.doFilter(request, response);
        } catch (AccessDeniedException exception) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write(
                    SerializableUtils.toJson(
                            SerializableUtils.singletonMap("error", exception.getMessage())
                    )
            );
        }
    }

}
