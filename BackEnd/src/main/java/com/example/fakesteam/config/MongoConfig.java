package com.example.fakesteam.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.example.fakesteam.repository")
public class MongoConfig {
    // La configuración se maneja a través de application.properties
} 