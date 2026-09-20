package com.mincom.gediibackend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/services").permitAll()

                        // Profil utilisateur : accessible à tous les utilisateurs connectés
                        .requestMatchers("/api/utilisateurs/me", "/api/utilisateurs/me/photo").authenticated()

                        // Reste des routes utilisateurs : uniquement RESPONSABLE
                        .requestMatchers("/api/utilisateurs/**").hasRole("RESPONSABLE")

                        .requestMatchers(org.springframework.http.HttpMethod.PUT, "/api/demandes/*/valider", "/api/demandes/*/rejeter").hasRole("RESPONSABLE")
                        .requestMatchers("/api/demandes/en-attente", "/api/demandes/validees").hasRole("RESPONSABLE")

                        // Interventions : assignation + consultation par technicien = RESPONSABLE
                        .requestMatchers("/api/interventions/assigner").hasRole("RESPONSABLE")
                        .requestMatchers(org.springframework.http.HttpMethod.GET, "/api/interventions/technicien/*").hasRole("RESPONSABLE")

                        .requestMatchers("/api/statistiques/**").hasRole("RESPONSABLE")
                        .requestMatchers(org.springframework.http.HttpMethod.DELETE, "/api/services/**").hasRole("RESPONSABLE")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}