package com.portfolio.urlshortener.repository;

import com.portfolio.urlshortener.entity.ClickLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClickLogRepository extends JpaRepository<ClickLog, Long> {
    long countByShortCode(String shortCode);
}