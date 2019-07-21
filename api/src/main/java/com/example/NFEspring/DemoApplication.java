package com.example.NFEspring;

import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.security.Key;

@SpringBootApplication
public class DemoApplication {

    public static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    public static void main(String[] args) {
        ApplicationContext context = SpringApplication.run(DemoApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {

            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry
                        .addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "DELETE", "PUT", "PATCH", "HEAD", "OPTIONS")
                        .allowedHeaders("Access-Control-Allow-Origin", "Content-Type")
                        .allowCredentials(false)
                        .maxAge(3600);
            }

        };
    }

}
