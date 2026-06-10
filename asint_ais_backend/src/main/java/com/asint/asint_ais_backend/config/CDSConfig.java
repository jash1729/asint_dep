package com.asint.asint_dep.config;


import com.sap.cds.services.CdsRuntime;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;

@Configuration
public class CDSConfig {

    @Bean
    public CdsRuntime cdsRuntime() {
        return CdsRuntime.getInstance();
    }
}

