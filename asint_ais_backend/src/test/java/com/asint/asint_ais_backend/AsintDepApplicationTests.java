package com.asint.asint_ais_backend;

import org.junit.Assert;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * Dependency-check tests. Tagged {@code fast} so the {@code unit-tests}
 * Maven profile (which filters by {@code <groups>fast</groups>}) picks them up.
 *
 * <p>These tests do not boot the Spring context on purpose &mdash; the goal of
 * the demo workspace is to prove that every Maven dependency declared in the
 * pom resolves and compiles. Each test loads one such dependency's flagship
 * class so a missing or incompatible artifact fails the build.</p>
 */
@Tag("fast")
class AsintDepApplicationTests {

    @Test
    void junit4DependencyIsResolved() {
        // Proves junit:junit:4.13.2 is on the test classpath
        Assert.assertTrue(true);
    }

    @Test
    void coreDependencyClassesAreResolvable() throws Exception {
        // Each Class.forName below corresponds to a unique pom dependency.
        // If any artifact is missing the JVM throws ClassNotFoundException
        // and this test fails.
        assertNotNull(Class.forName("com.sap.cds.services.runtime.CdsRuntime"));            // cds-services-impl
        assertNotNull(Class.forName("com.sap.cloud.sdk.cloudplatform.tenant.TenantAccessor")); // sdk-core
        assertNotNull(Class.forName("org.apache.poi.xssf.usermodel.XSSFWorkbook"));         // poi-ooxml
        assertNotNull(Class.forName("com.monitorjbl.xlsx.StreamingReader"));                 // xlsx-streamer
        assertNotNull(Class.forName("org.apache.commons.math3.stat.descriptive.DescriptiveStatistics")); // commons-math3
        assertNotNull(Class.forName("org.apache.pdfbox.pdmodel.PDDocument"));                // pdfbox
        assertNotNull(Class.forName("javafx.scene.paint.Color"));                            // javafx-graphics
        assertNotNull(Class.forName("org.apache.olingo.odata2.api.ODataServiceVersion"));    // olingo-odata2-api
        assertNotNull(Class.forName("com.fasterxml.jackson.dataformat.xml.XmlMapper"));      // jackson-dataformat-xml
        assertNotNull(Class.forName("org.springdoc.core.SpringDocConfiguration"));           // springdoc-openapi-ui
        assertNotNull(Class.forName("org.apache.activemq.ActiveMQConnectionFactory"));       // activemq-client
        assertNotNull(Class.forName("org.apache.activemq.broker.BrokerService"));            // activemq-broker
        assertNotNull(Class.forName("org.apache.activemq.store.kahadb.KahaDBStore"));        // activemq-kahadb-store
        assertNotNull(Class.forName("org.apache.http.entity.mime.MultipartEntityBuilder"));  // httpmime
        assertNotNull(Class.forName("org.openjdk.nashorn.api.scripting.NashornScriptEngineFactory")); // nashorn-core
        assertNotNull(Class.forName("io.github.bucket4j.Bucket"));                           // bucket4j-core
        assertNotNull(Class.forName("redis.clients.jedis.Jedis"));                           // jedis
    }
}
