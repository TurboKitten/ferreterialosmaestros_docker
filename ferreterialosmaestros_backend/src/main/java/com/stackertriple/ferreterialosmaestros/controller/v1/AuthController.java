package com.stackertriple.ferreterialosmaestros.controller.v1;

import com.stackertriple.ferreterialosmaestros.dto.request.LoginRequest;
import com.stackertriple.ferreterialosmaestros.dto.response.SesionResponse;
import com.stackertriple.ferreterialosmaestros.model.entity.Usuario;
import com.stackertriple.ferreterialosmaestros.repository.UsuarioRepository;
import com.stackertriple.ferreterialosmaestros.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * Login con JWT (EP3): valida credenciales y devuelve un token firmado
 * que el frontend debe enviar en "Authorization: Bearer <token>".
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UsuarioRepository usuarioRepository, JwtService jwtService, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String username = req.resolvedUsername();
        if (username == null || username.isBlank() || req.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Usuario y contraseña requeridos"));
        }

        String buscado = username.trim().toLowerCase();
        var encontrado = usuarioRepository.findByUsername(buscado)
                .filter(u -> Boolean.TRUE.equals(u.getEnabled()));

        if (encontrado.isEmpty() || !passwordCoincide(req.password(), encontrado.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Credenciales inválidas"));
        }

        Usuario usuario = encontrado.get();

        // Migración transparente: si la contraseña estaba en texto plano, se guarda cifrada
        if (!estaCifrada(usuario.getPassword())) {
            usuario.setPassword(passwordEncoder.encode(req.password()));
            usuario = usuarioRepository.save(usuario);
        }

        String rol = nombreRol(usuario);
        String token = jwtService.generateToken(usuario.getUsername(), usuario.getRol().name());

        return ResponseEntity.ok(new SesionResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getUsername(),
                rol,
                token
        ));
    }

    private boolean passwordCoincide(String raw, String stored) {
        if (stored == null) return false;
        if (estaCifrada(stored)) {
            return passwordEncoder.matches(raw, stored);
        }
        return raw.equals(stored); // contraseñas legadas en texto plano (MVP)
    }

    private boolean estaCifrada(String stored) {
        return stored != null && (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$"));
    }

    private String nombreRol(Usuario u) {
        return switch (u.getRol()) {
            case ADMINISTRADOR -> "Administrador";
            case VENDEDOR -> "Vendedor";
            case CLIENTE -> "Cliente";
        };
    }
}
