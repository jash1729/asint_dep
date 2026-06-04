package com.asint.asint_dep.controller;

import com.asint.asint_dep.service.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Autowired
    private AssetService assetService;

    @GetMapping
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("OK - " + assetService.getStatus());
    }
}
