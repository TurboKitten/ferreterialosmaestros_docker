package com.stackertriple.ferreterialosmaestros.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Documentación de la API con OpenAPI 3 / Swagger UI (EP3 - paso 6).
 *
 * <p>Swagger UI queda disponible en {@code /swagger-ui.html} y el contrato JSON
 * en {@code /v3/api-docs}. El esquema {@code bearerAuth} habilita el botón
 * "Authorize" para probar los endpoints protegidos con el JWT del login.</p>
 */
@Configuration
public class OpenApiConfig {

    public static final String SECURITY_SCHEME_NAME = "bearerAuth";

    @Bean
    public OpenAPI ferreteriaOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Ferretería Los Maestros - API REST")
                        .version("1.0.0")
                        .description("""
                                API REST versionada del sistema Ferretería Los Maestros (DSY1104 - EP3).

                                **Flujo de autenticación**
                                1. Ejecutar `POST /api/v1/auth/login` con un usuario y contraseña válidos.
                                2. Copiar el `token` de la respuesta.
                                3. Pulsar el botón **Authorize** y pegar el token (sin la palabra `Bearer`).
                                4. Probar los endpoints protegidos según el rol del usuario.

                                **Roles**
                                - `Administrador`: CRUD de productos, usuarios y acceso total a pedidos.
                                - `Vendedor`: catálogo y gestión de pedidos.
                                - `Cliente`: catálogo y solo sus propios pedidos.
                                """)
                        .contact(new Contact()
                                .name("StackerTriple")
                                .email("contacto@stackertriple.cl"))
                        .license(new License()
                                .name("Proyecto académico DSY1104")
                                .url("https://github.com/TurboKitten")))
                .addServersItem(new Server()
                        .url("/")
                        .description("Servidor actual (mismo host donde corre la API)"))
                .components(new Components()
                        .addSecuritySchemes(SECURITY_SCHEME_NAME, new SecurityScheme()
                                .name(SECURITY_SCHEME_NAME)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .description("Token JWT obtenido en POST /api/v1/auth/login")));
    }
}
