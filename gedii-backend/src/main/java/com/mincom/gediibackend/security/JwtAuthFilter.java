package com.mincom.gediibackend.security;

import com.mincom.gediibackend.entity.Utilisateur;
import com.mincom.gediibackend.repository.UtilisateurRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UtilisateurRepository utilisateurRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, UtilisateurRepository utilisateurRepository) {
        this.jwtUtil = jwtUtil;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        System.out.println("###### REQUETE: " + request.getMethod() + " " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");
        System.out.println("###### Authorization header recu: [" + authHeader + "]");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("###### PAS DE BEARER VALIDE - on continue sans authentification");
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("###### Token extrait (20 premiers car.): " + token.substring(0, Math.min(20, token.length())));

        boolean valide = jwtUtil.isTokenValid(token);
        System.out.println("###### Token valide selon jwtUtil.isTokenValid(): " + valide);

        if (valide) {
            String email = jwtUtil.extractEmail(token);
            System.out.println("###### Email extrait du token: " + email);

            Optional<Utilisateur> utilisateurOpt = utilisateurRepository.findByEmail(email);
            System.out.println("###### Utilisateur trouve en base: " + utilisateurOpt.isPresent());

            if (utilisateurOpt.isPresent() && SecurityContextHolder.getContext().getAuthentication() == null) {
                Utilisateur utilisateur = utilisateurOpt.get();
                System.out.println("###### Role de l'utilisateur: " + utilisateur.getRole());

                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole().name()));
                System.out.println("###### Authority assignee: " + authorities);

                var authToken = new UsernamePasswordAuthenticationToken(utilisateur, null, authorities);
                SecurityContextHolder.getContext().setAuthentication(authToken);
                System.out.println("###### Authentication mise dans le SecurityContext");
            }
        }

        filterChain.doFilter(request, response);
    }
}