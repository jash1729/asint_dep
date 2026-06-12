package com.asint.asint_ais_backend.service;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.monitorjbl.xlsx.StreamingReader;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import javafx.scene.paint.Color;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.olingo.odata2.api.ODataServiceVersion;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.openjdk.nashorn.api.scripting.NashornScriptEngineFactory;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import javax.script.ScriptEngine;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Map;

/**
 * Exercises the long tail of "utility" dependencies in pom.xml so the build
 * fails immediately if any of them is missing from the classpath.
 *
 * Dependencies referenced here:
 *   - org.apache.poi:poi-ooxml          (XSSFWorkbook)
 *   - com.monitorjbl:xlsx-streamer      (StreamingReader)
 *   - org.apache.commons:commons-math3  (DescriptiveStatistics)
 *   - org.apache.pdfbox:pdfbox          (PDDocument)
 *   - org.openjfx:javafx-base/graphics  (Color)
 *   - org.apache.olingo:olingo-odata2-* (ODataServiceVersion)
 *   - com.fasterxml.jackson.dataformat:jackson-dataformat-xml (XmlMapper)
 *   - org.apache.httpcomponents:httpmime (MultipartEntityBuilder)
 *   - org.openjdk.nashorn:nashorn-core  (NashornScriptEngineFactory)
 *   - com.github.vladimir-bukhtoyarov:bucket4j-core (Bucket)
 *   - spring-boot-starter-cache         (@Cacheable)
 */
@Service
public class UtilityDemoService {

    private final Bucket rateLimiter = Bucket.builder()
        .addLimit(Bandwidth.simple(100, Duration.ofMinutes(1)))
        .build();

    public boolean tryRateLimit() {
        return rateLimiter.tryConsume(1);
    }

    public double meanOf(double[] values) {
        DescriptiveStatistics stats = new DescriptiveStatistics(values);
        return stats.getMean();
    }

    @Cacheable("xlsxBytes")
    public byte[] buildXlsx() throws Exception {
        try (Workbook wb = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            wb.createSheet("demo");
            wb.write(out);
            return out.toByteArray();
        }
    }

    public int countRowsStreaming(byte[] xlsx) throws Exception {
        int rows = 0;
        try (Workbook wb = StreamingReader.builder().open(new ByteArrayInputStream(xlsx))) {
            for (Sheet sheet : wb) {
                for (Row row : sheet) {
                    rows++;
                    // touch row to keep iterator happy
                    if (row.getRowNum() < 0) {
                        break;
                    }
                }
            }
        }
        return rows;
    }

    public byte[] buildPdf() throws Exception {
        try (PDDocument doc = new PDDocument(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            doc.addPage(new PDPage());
            doc.save(out);
            return out.toByteArray();
        }
    }

    public String javafxColor() {
        return Color.AQUA.toString();
    }

    public String odataVersion() {
        return ODataServiceVersion.V20;
    }

    public String toXml(Map<String, Object> data) throws Exception {
        return new XmlMapper().writeValueAsString(data);
    }

    public byte[] buildMultipart(String body) throws Exception {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            MultipartEntityBuilder.create()
                .addPart("payload", new StringBody(body,
                    org.apache.http.entity.ContentType.TEXT_PLAIN.withCharset(StandardCharsets.UTF_8)))
                .build()
                .writeTo(out);
            return out.toByteArray();
        }
    }

    public Object runNashorn(String script) throws Exception {
        ScriptEngine engine = new NashornScriptEngineFactory().getScriptEngine();
        return engine.eval(script);
    }
}
