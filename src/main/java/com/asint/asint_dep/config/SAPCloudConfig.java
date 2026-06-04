package com.asint.asint_dep.config;

import com.sap.cloud.sdk.cloudplatform.CloudPlatform;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Bean;

@Configuration
public class SAPCloudConfig {

    @Bean
    public CloudPlatform cloudPlatform() {
        return CloudPlatform.INSTANCE;
    }
}
