package com.example.NFEspring.middleware;

import com.example.NFEspring.entity.Permission;
import com.example.NFEspring.provider.PermissionProvider;
import javassist.NotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;
import com.example.NFEspring.utils.JwtUtils;
import com.example.NFEspring.utils.SerializableUtils;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

public class PermissionFilter extends OncePerRequestFilter implements Filter {

    @Override
    public void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        try {
            List<Permission> permissions = JwtUtils.getPermissions(request.getAttribute("claims"));

            Optional<Permission> permission = permissions
                    .stream()
                    .filter(
                            p -> request.getRequestURI().toLowerCase().startsWith(
                                    p.getEntity().getLabel().toLowerCase()
                            )
                    )
                    .findFirst();

            Optional.of(
                    PermissionProvider.isAccessible(
                            permission.orElseThrow(() -> new AccessDeniedException("Forbidden: you do not have the necessary rights to access the resource")),
                            request.getMethod()
                    )
            ).filter(p -> p).orElseThrow(() -> new AccessDeniedException("Forbidden: you do not have the necessary rights to access the resource"));

            filterChain.doFilter(request, response);
        } catch (AccessDeniedException | NotFoundException exception) {
            response.setStatus(HttpStatus.UNAUTHORIZED.value());
            response.getWriter().write(
                    SerializableUtils.toJson(
                            SerializableUtils.singletonMap("error", exception.getMessage())
                    )
            );
        }
    }

}
