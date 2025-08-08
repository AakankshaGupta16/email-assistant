package com.email.writer.app;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.io.IOException;
import java.util.Map;
import jakarta.annotation.PostConstruct;

/**
 * Service class responsible for generating email replies using the Gemini API.
 */
@Service
public class EmailGeneratorService {

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private WebClient webClient;

    @PostConstruct
    public void initializeWebClient() {
        this.webClient = WebClient.builder().baseUrl(geminiApiUrl).build();
    }

    public String generateEmailReply(EmailRequest emailRequest) {
        String prompt = buildPrompt(emailRequest);

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of(
                                "parts", new Object[]{
                                        Map.of("text", prompt)
                                }
                        )
                }
        );

        // Making the request with the recommended addition of the Content-Type header.
        String response = webClient.post()
                .uri(uriBuilder -> uriBuilder.queryParam("key", geminiApiKey).build())
                .contentType(MediaType.APPLICATION_JSON) // This is the recommended addition
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        return extractResponseContent(response);
    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);

            // Correctly access nested JSON nodes
            return rootNode.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();
        } catch (IOException | NullPointerException | IndexOutOfBoundsException e) {
            System.err.println("Error Processing Request: " + e.getMessage());
            return "Error Processing Request: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Generate a formal reply for the given email content. Please don't generate the subject line. ");

        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            prompt.append("Use a ").append(emailRequest.getTone()).append(" tone. ");
        }

        prompt.append("\nOriginal email:\n").append(emailRequest.getEmailContent());
        return prompt.toString();
    }
}
