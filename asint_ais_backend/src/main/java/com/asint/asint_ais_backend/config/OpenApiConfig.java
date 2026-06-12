package com.asint.asint_ais_backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Exercises springdoc-openapi-starter-webmvc-ui.
 * Swagger UI is exposed at /swagger-ui/index.html.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI dependencyCheckOpenApi() {
        return new OpenAPI()
            .info(new Info()
                .title("ASINT Dependency Check API")
                .description("Demo API exercising every Maven dependency")
                .version("0.0.1"));
    }
}
