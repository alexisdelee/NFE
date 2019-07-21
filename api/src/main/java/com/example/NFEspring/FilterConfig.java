package com.example.NFEspring;

import com.example.NFEspring.middleware.CorsFilter;
import com.example.NFEspring.middleware.JWTAuthenticationFilter;
import com.example.NFEspring.middleware.PermissionFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;

import javax.servlet.Filter;

@Configuration
public class FilterConfig {

    private static <T extends Filter> FilterRegistrationBean<T> fillBean(FilterRegistrationBean<T> bean) {
        bean.addUrlPatterns("/categories/*");
        bean.addUrlPatterns("/links/*");
        bean.addUrlPatterns("/priorities/*");
        bean.addUrlPatterns("/regions/*");
        bean.addUrlPatterns("/status/*");
        bean.addUrlPatterns("/tickets/*");
        bean.addUrlPatterns("/trackers/*");
        bean.addUrlPatterns("/items/*");
        bean.addUrlPatterns("/histories/*");
        bean.addUrlPatterns("/statistics/*");

        return bean;
    }

    @Bean
    public FilterRegistrationBean<JWTAuthenticationFilter> jwtFilter() {
        FilterRegistrationBean<JWTAuthenticationFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(new JWTAuthenticationFilter());
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE + 1);

        registrationBean = FilterConfig.fillBean(registrationBean);

        return registrationBean;
    }

    @Bean
    public FilterRegistrationBean<PermissionFilter> permissionFilter() {
        FilterRegistrationBean<PermissionFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(new PermissionFilter());
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE + 2);

        registrationBean = FilterConfig.fillBean(registrationBean);

        return registrationBean;
    }

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        FilterRegistrationBean<CorsFilter> registrationBean = new FilterRegistrationBean<>();

        registrationBean.setFilter(new CorsFilter());
        registrationBean.setOrder(Ordered.HIGHEST_PRECEDENCE);

        registrationBean = FilterConfig.fillBean(registrationBean);
        registrationBean.addUrlPatterns("/auth/*");
        registrationBean.addUrlPatterns("/externals/*");

        return registrationBean;
    }

}
