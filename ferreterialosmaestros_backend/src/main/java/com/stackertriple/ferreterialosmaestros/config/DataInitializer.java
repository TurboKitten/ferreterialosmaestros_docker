package com.stackertriple.ferreterialosmaestros.config;

import com.stackertriple.ferreterialosmaestros.model.entity.Producto;
import com.stackertriple.ferreterialosmaestros.model.entity.Rol;
import com.stackertriple.ferreterialosmaestros.model.entity.Usuario;
import com.stackertriple.ferreterialosmaestros.repository.ProductoRepository;
import com.stackertriple.ferreterialosmaestros.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

/**
 * MVP: carga datos iniciales si la base está vacía (útil para docker-compose/demo).
 * Las contraseñas se guardan cifradas con BCrypt (el login soporta además texto plano legado).
 */
@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UsuarioRepository usuarioRepository, ProductoRepository productoRepository,
                                PasswordEncoder passwordEncoder) {
        return args -> {
            if (usuarioRepository.count() == 0) {
                usuarioRepository.saveAll(List.of(
                        user("admin", "Administrador", passwordEncoder.encode("admin123"), Rol.ADMINISTRADOR, "admin@ferreteria.cl"),
                        user("aabarca", "Antonia Abarca", passwordEncoder.encode("1234"), Rol.ADMINISTRADOR, "aabarca@ferreteria.cl"),
                        user("dgarrid", "Diego Garrido", passwordEncoder.encode("1234"), Rol.VENDEDOR, "dgarrid@ferreteria.cl"),
                        user("cliente", "Cliente Demo", passwordEncoder.encode("1234"), Rol.CLIENTE, "cliente@ferreteria.cl")
                ));
            }
            if (productoRepository.count() == 0) {
                productoRepository.saveAll(List.of(
                        prod("FER-001", "Martillo Profesional", "manuales", "12990", 15),
                        prod("FER-002", "Juego de Destornilladores", "manuales", "9990", 20),
                        prod("FER-003", "Taladro Percutor 750W", "electricas", "59990", 8),
                        prod("FER-004", "Sierra Circular 1400W", "electricas", "79990", 5),
                        prod("FER-005", "Cemento 25kg", "materiales", "5990", 50),
                        prod("FER-006", "Pintura Látex 1 Galón", "pinturas", "18990", 12)
                ));
            }
        };
    }

    private Usuario user(String username, String nombre, String password, Rol rol, String email) {
        Usuario u = new Usuario();
        u.setUsername(username);
        u.setNombre(nombre);
        u.setPassword(password);
        u.setRol(rol);
        u.setEnabled(true);
        u.setEmail(email);
        return u;
    }

    private Producto prod(String codigo, String nombre, String categoria, String precio, int stock) {
        Producto p = new Producto();
        p.setCodigo(codigo);
        p.setNombre(nombre);
        p.setCategoria(categoria);
        p.setPrecio(new BigDecimal(precio));
        p.setStock(stock);
        p.setActivo(true);
        return p;
    }
}
