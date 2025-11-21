package com.portfolio.urlshortener.service;

import com.portfolio.urlshortener.entity.ClickLog;
import com.portfolio.urlshortener.entity.Url;
import com.portfolio.urlshortener.repository.ClickLogRepository;
import com.portfolio.urlshortener.repository.UrlRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;

@Service
public class UrlService {

    @Autowired
    private UrlRepository urlRepository;

    @Autowired
    private ClickLogRepository clickLogRepository;

    @Autowired
    private StringRedisTemplate redisTemplate;

    private final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private final int CODE_LENGTH = 6;

    public String shortenUrl(String originalUrl) {
        String shortCode = generateShortCode();
        Url url = new Url();
        url.setOriginalUrl(originalUrl);
        url.setShortCode(shortCode);
        urlRepository.save(url);

        redisTemplate.opsForValue().set(shortCode, originalUrl, Duration.ofHours(24));

        return shortCode;
    }

    public String getOriginalUrl(String shortCode) {
        String urlOriginal = redisTemplate.opsForValue().get(shortCode);

        if (urlOriginal == null) {
            Url url = urlRepository.findByShortCode(shortCode)
                    .orElseThrow(() -> new RuntimeException("URL not found"));
            urlOriginal = url.getOriginalUrl();
            redisTemplate.opsForValue().set(shortCode, urlOriginal, Duration.ofHours(24));
        }

        recordClick(shortCode);

        return urlOriginal;
    }

    @Async
    public void recordClick(String shortCode) {
        ClickLog log = new ClickLog();
        log.setShortCode(shortCode);
        clickLogRepository.save(log);
    }

    public long getTotalClicks(String shortCode) {
        return clickLogRepository.countByShortCode(shortCode);
    }

    private String generateShortCode() {
        StringBuilder sb = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < CODE_LENGTH; i++) {
            sb.append(CHARACTERS.charAt(random.nextInt(CHARACTERS.length())));
        }
        return sb.toString();
    }
}