package com.asint.asint_dep.controller;

import com.asint.asint_dep.service.DependencyCheckService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dependencies")
public class DependencyCheckController {

    @Autowired
    private DependencyCheckService dependencyCheckService;

    @GetMapping("/status")
    public ResponseEntity<String> checkDependencies() {
        return ResponseEntity.ok(dependencyCheckService.checkDependencies());
    }
}
