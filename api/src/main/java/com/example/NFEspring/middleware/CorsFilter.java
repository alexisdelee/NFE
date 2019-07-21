package com.example.NFEspring.middleware;

import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class CorsFilter extends OncePerRequestFilter implements Filter {

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT, PATCH, HEAD, OPTIONS");
        response.addHeader("Access-Control-Allow-Headers", "Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
        response.addHeader("Access-Control-Expose-Headers", "Access-Control-Allow-Origin, x-access-token");
        response.addHeader("Access-Control-Allow-Credentials", "false");
        response.addHeader("Accept", "application/json");
        response.addHeader("Content-Type", "application/json");

        response.addIntHeader("Access-Control-Max-Age", 1800);

        if (request.getMethod().toLowerCase().equals("options")) {
            response.setStatus(HttpStatus.OK.value());
            return;
        }

        filterChain.doFilter(request, response);
    }

}
