package com.asint.asint_dep.service;

import org.springframework.stereotype.Service;

@Service
public class AssetService {
    
    public String getStatus() {
        return "Asset service initialized with all dependencies";
    }
}
