package com.asint.asint_ais_backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.core.JmsTemplate;

import jakarta.jms.ConnectionFactory;
import org.apache.activemq.ActiveMQConnectionFactory;

/**
 * Exercises spring-boot-starter-activemq, activemq-broker, activemq-client and
 * activemq-kahadb-store. An embedded in-memory broker is started lazily on
 * first message access via "vm://embedded".
 */
@Configuration
@EnableJms
public class JmsConfig {

    @Value("${spring.activemq.broker-url:vm://embedded?broker.persistent=false}")
    private String brokerUrl;

    @Bean
    public ConnectionFactory jmsConnectionFactory() {
        return new ActiveMQConnectionFactory(brokerUrl);
    }

    @Bean
    public JmsTemplate jmsTemplate(ConnectionFactory factory) {
        return new JmsTemplate(factory);
    }
}
