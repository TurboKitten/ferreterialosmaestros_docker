package com.stackertriple.ferreterialosmaestros.controller.v1;

import com.stackertriple.ferreterialosmaestros.dto.request.LoginRequest;
import com.stackertriple.ferreterialosmaestros.dto.response.SesionResponse;
import com.stackertriple.ferreterialosmaestros.model.entity.Usuario;
import com.stackertriple.ferreterialosmaestros.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * MVP (Fase 1): login simple sin JWT. Fase 2 reemplazará con JWT + Spring Security.
 */
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        String username = req.resolvedUsername();
        if (username == null || req.password() == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Usuario y contraseña requeridos"));
        }
        return usuarioRepository.findByUsername(username)
                .filter(u -> Boolean.TRUE.equals(u.getEnabled()))
                .filter(u -> req.password().equals(u.getPassword()))
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(toSesion(u)))
                .orElse(ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Credenciales inválidas")));
    }

    private SesionResponse toSesion(Usuario u) {
        String rol = u.getRol() != null ? switch (u.getRol()) {
            case ADMINISTRADOR -> "Administrador";
            case VENDEDOR -> "Vendedor";
            case CLIENTE -> "Cliente";
        } : null;
        return new SesionResponse(u.getId(), u.getNombre(), u.getUsername(), rol, u.getEnabled(), u.getEmail());
    }
}
