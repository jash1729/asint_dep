package com.asint.asint_ais_backend.controller;

import com.asint.asint_ais_backend.entity.Asset;
import com.asint.asint_ais_backend.service.CdsDemoService;
import com.asint.asint_ais_backend.service.MailDemoService;
import com.asint.asint_ais_backend.service.MessagingDemoService;
import com.asint.asint_ais_backend.service.UtilityDemoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Aggregates every demo service into a single REST surface so the dependency
 * graph is touched at runtime when /api/check/* endpoints are hit.
 */
@RestController
@RequestMapping("/api/check")
public class DependencyCheckController {

    @Autowired private CdsDemoService cdsDemo;
    @Autowired private UtilityDemoService utilDemo;
    @Autowired private MessagingDemoService msgDemo;
    @Autowired private MailDemoService mailDemo;

    @GetMapping("/cds")
    public ResponseEntity<String> cds() {
        return ResponseEntity.ok(cdsDemo.describe());
    }

    @GetMapping("/utility")
    public ResponseEntity<Map<String, Object>> utility() throws Exception {
        byte[] xlsx = utilDemo.buildXlsx();
        return ResponseEntity.ok(Map.of(
            "rateLimitConsumed", utilDemo.tryRateLimit(),
            "mean", utilDemo.meanOf(new double[]{1.0, 2.0, 3.0, 4.0}),
            "xlsxBytes", xlsx.length,
            "xlsxRows", utilDemo.countRowsStreaming(xlsx),
            "pdfBytes", utilDemo.buildPdf().length,
            "color", utilDemo.javafxColor(),
            "odataVersion", utilDemo.odataVersion(),
            "xml", utilDemo.toXml(Map.of("hello", "world")),
            "multipartBytes", utilDemo.buildMultipart("hi").length,
            "nashorn", utilDemo.runNashorn("1 + 2")
        ));
    }

    @PostMapping(value = "/asset", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Asset> echo(@Valid @RequestBody Asset asset) {
        return ResponseEntity.ok(asset);
    }

    @GetMapping("/mail")
    public ResponseEntity<String> mail() {
        return ResponseEntity.ok(mailDemo.compose("dev@asint.local",
            "demo", "body").getSubject());
    }

    @GetMapping("/messaging")
    public ResponseEntity<String> messaging() {
        // Don't actually connect to redis/jms — just prove beans are wired
        return ResponseEntity.ok("redis=" + (msgDemo != null) + ", webclient ready");
    }
}
