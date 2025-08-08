package com.email.writer.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication  // ✅ This is required!
public class EmailWriterSbApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmailWriterSbApplication.class, args);
    }
}
