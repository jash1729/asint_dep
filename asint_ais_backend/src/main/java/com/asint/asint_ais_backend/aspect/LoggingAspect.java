package com.asint.asint_ais_backend.aspect;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * Exercises spring-boot-starter-aop (aspectj-weaver + spring-aop).
 */
@Aspect
@Component
public class LoggingAspect {

    private static final Logger log = LoggerFactory.getLogger(LoggingAspect.class);

    @Before("execution(* com.asint.asint_ais_backend.service..*(..))")
    public void logServiceCall(JoinPoint joinPoint) {
        log.debug("Invoking {}", joinPoint.getSignature());
    }
}
