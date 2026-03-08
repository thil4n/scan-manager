package com.wso2.vms.scanner;

import com.wso2.vms.api.scanner.model.ScanJob;
import com.wso2.vms.api.scanner.service.ScanJobService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ScanJobController.class)
public class ScanJobControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ScanJobService scanJobService;

    @Test
    public void testCreateScanJob() throws Exception {
        String payload = "{" +
                "\"scanId\": \"" + UUID.randomUUID() + "\"," +
                "\"product\": \"APIM\"," +
                "\"version\": \"4.6.0\"," +
                "\"scanType\": \"SAST\"," +
                "\"tool\": \"SEMGREP\"," +
                "\"repositoryUrl\": \"https://github.com/org/apim\"}";
        mockMvc.perform(post("/scanner/jobs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(payload))
                .andExpect(status().isAccepted());
    }

    @Test
    public void testGetScanJobStatusNotFound() throws Exception {
        UUID scanId = UUID.randomUUID();
        Mockito.when(scanJobService.getScanJob(scanId)).thenReturn(null);
        mockMvc.perform(get("/scanner/jobs/" + scanId))
                .andExpect(status().isNotFound());
    }
}
