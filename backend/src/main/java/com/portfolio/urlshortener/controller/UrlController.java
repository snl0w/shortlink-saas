package com.portfolio.urlshortener.controller;

import com.portfolio.urlshortener.service.UrlService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class UrlController {

    @Autowired
    private UrlService urlService;

    @PostMapping("/api/v1/shorten")
    public ResponseEntity<Map<String, String>> shorten(@RequestBody Map<String, String> request) {
        String originalUrl = request.get("url");
        String shortCode = urlService.shortenUrl(originalUrl);

        return ResponseEntity.ok(Map.of(
                "code", shortCode,
                "shortUrl", "http://localhost:8080/" + shortCode));
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {
        String originalUrl = urlService.getOriginalUrl(shortCode);

        return ResponseEntity.status(302)
                .location(URI.create(originalUrl))
                .build();
    }

    @GetMapping("/api/v1/analytics/{shortCode}")
    public ResponseEntity<Map<String, Long>> getAnalytics(@PathVariable String shortCode) {
        long clicks = urlService.getTotalClicks(shortCode);

        return ResponseEntity.ok(Map.of(
                "totalClicks", clicks));
    }
}