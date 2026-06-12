package com.asint.asint_ais_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Entry point for the dependency-check Spring Boot application.
 * Every dependency declared in pom.xml is referenced somewhere in this module
 * to guarantee classpath resolution and successful compilation.
 */
@SpringBootApplication
@EnableCaching
@EnableAsync
public class AsintDepApplication {

    public static void main(String[] args) {
        SpringApplication.run(AsintDepApplication.class, args);
    }
}

