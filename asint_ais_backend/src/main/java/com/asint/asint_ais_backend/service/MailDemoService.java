package com.asint.asint_ais_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Exercises spring-boot-starter-mail.
 */
@Service
public class MailDemoService {

    @Autowired
    private JavaMailSender mailSender;

    public SimpleMailMessage compose(String to, String subject, String text) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(text);
        return msg;
    }

    public JavaMailSender sender() {
        return mailSender;
    }
}
