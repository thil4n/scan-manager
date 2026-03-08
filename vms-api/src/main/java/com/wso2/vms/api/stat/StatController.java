package com.wso2.vms.api.stat;

import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/stat")
public class StatController {

    private final StatService statService;

    public StatController(StatService statService) {
        this.statService = statService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public StatResponse getCategories() {
        return statService.getStatistics();
    }
}
