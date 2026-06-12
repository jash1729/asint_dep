package com.asint.asint_ais_backend.service;

import com.sap.cds.services.runtime.CdsRuntime;
import com.sap.cloud.sdk.cloudplatform.tenant.TenantAccessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * Exercises:
 *   - cds-starter-spring-boot / cds-services-impl (CdsRuntime)
 *   - cds-starter-cloudfoundry (transitive)
 *   - cds-adapter-odata-v4 (runtime)
 *   - cds-feature-remote-odata (runtime)
 *   - cds-integration-cloud-sdk (cds &lt;-&gt; SDK glue)
 *   - sap-cloud-sdk sdk-core (TenantAccessor)
 */
@Service
public class CdsDemoService {

    @Autowired(required = false)
    private CdsRuntime cdsRuntime;

    public String describe() {
        StringBuilder sb = new StringBuilder();
        sb.append("CDS runtime: ").append(cdsRuntime != null ? "present" : "absent").append('\n');
        sb.append("Current tenant: ")
          .append(TenantAccessor.tryGetCurrentTenant()
                                .map(t -> t.getTenantId())
                                .getOrElse("none"))
          .append('\n');
        return sb.toString();
    }
}
