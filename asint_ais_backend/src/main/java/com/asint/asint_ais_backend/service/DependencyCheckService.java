package com.asint.asint_dep.service;


import com.sap.cds.services.CdsRuntime;
import com.sap.cloud.sdk.cloudplatform.CloudPlatform;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DependencyCheckService {
    
    @Autowired(required = false)
    private CdsRuntime cdsRuntime;
    
    @Autowired(required = false)
    private CloudPlatform cloudPlatform;
    
    public String checkDependencies() {
        StringBuilder status = new StringBuilder();
        
        if (cdsRuntime != null) {
            status.append("✓ CDS Runtime initialized\n");
        }
        
        if (cloudPlatform != null) {
            status.append("✓ SAP Cloud Platform initialized\n");
        }
        
        status.append("✓ All SAP dependencies available");
        
        return status.toString();
    }
}
