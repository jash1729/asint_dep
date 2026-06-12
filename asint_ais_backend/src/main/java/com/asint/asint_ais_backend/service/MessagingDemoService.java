package com.asint.asint_ais_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;

/**
 * Exercises Spring messaging/data starters:
 *   - spring-boot-starter-data-redis + jedis (StringRedisTemplate + JedisPool)
 *   - spring-boot-starter-activemq          (JmsTemplate)
 *   - spring-boot-starter-webflux           (WebClient + reactor)
 */
@Service
public class MessagingDemoService {

    @Autowired
    private StringRedisTemplate redis;

    @Autowired
    private JmsTemplate jmsTemplate;

    @Autowired
    private WebClient webClient;

    public void putRedis(String key, String value) {
        redis.opsForValue().set(key, value);
    }

    public String getRedisDirect(String host, int port, String key) {
        try (JedisPool pool = new JedisPool(host, port); Jedis jedis = pool.getResource()) {
            return jedis.get(key);
        }
    }

    public void sendJms(String queue, String message) {
        jmsTemplate.convertAndSend(queue, message);
    }

    public Mono<String> fetch(String path) {
        return webClient.get().uri(path).retrieve().bodyToMono(String.class);
    }
}
