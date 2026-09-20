package com.mincom.gediibackend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    @Value("${supabase.url}")
    private String supabaseUrl;

    @Value("${supabase.service-key}")
    private String serviceKey;

    @Value("${supabase.bucket}")
    private String bucket;

    public String upload(MultipartFile file, Long userId) throws IOException, InterruptedException {
        String extension = "";
        String original = file.getOriginalFilename();
        if (original != null && original.contains(".")) {
            extension = original.substring(original.lastIndexOf("."));
        }

        String fileName = "user-" + userId + "-" + UUID.randomUUID() + extension;
        String uploadUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(uploadUrl))
                .header("Authorization", "Bearer " + serviceKey)
                .header("Content-Type", file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                .header("x-upsert", "true")
                .POST(HttpRequest.BodyPublishers.ofByteArray(file.getBytes()))
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 300) {
            throw new RuntimeException("Erreur upload Supabase : " + response.statusCode() + " - " + response.body());
        }

        return supabaseUrl + "/storage/v1/object/public/" + bucket + "/" + fileName;
    }

    public void delete(String publicUrl) throws IOException, InterruptedException {
        if (publicUrl == null || !publicUrl.contains("/storage/v1/object/public/" + bucket + "/")) {
            return;
        }

        String fileName = publicUrl.substring(publicUrl.lastIndexOf("/") + 1);
        String deleteUrl = supabaseUrl + "/storage/v1/object/" + bucket + "/" + fileName;

        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(deleteUrl))
                .header("Authorization", "Bearer " + serviceKey)
                .DELETE()
                .build();

        client.send(request, HttpResponse.BodyHandlers.ofString());
    }
}