package com.stackertriple.ferreterialosmaestros.controller.v1;

import com.stackertriple.ferreterialosmaestros.config.OpenApiConfig;
import com.stackertriple.ferreterialosmaestros.dto.request.ProductoRequest;
import com.stackertriple.ferreterialosmaestros.dto.response.ProductoResponse;
import com.stackertriple.ferreterialosmaestros.model.entity.Producto;
import com.stackertriple.ferreterialosmaestros.repository.ProductoRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Productos", description = "Catálogo público y CRUD de productos (escritura solo para Administrador)")
@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @Operation(summary = "Listar productos", description = "Devuelve todos los productos del catálogo. Endpoint público.")
    @ApiResponse(responseCode = "200", description = "Listado de productos",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = ProductoResponse.class))))
    @GetMapping
    public List<ProductoResponse> listar() {
        return productoRepository.findAll().stream().map(this::toResponse).toList();
    }

    @Operation(summary = "Obtener producto por ID", description = "Busca un producto por su identificador interno. Endpoint público.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto encontrado",
                    content = @Content(schema = @Schema(implementation = ProductoResponse.class))),
            @ApiResponse(responseCode = "404", description = "No existe un producto con ese ID", content = @Content)
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> obtener(
            @Parameter(description = "ID interno del producto", example = "1") @PathVariable Long id) {
        return productoRepository.findById(id)
                .map(p -> ResponseEntity.ok(toResponse(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Obtener producto por código", description = "Busca un producto por su código único (por ejemplo FER-001). Endpoint público.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto encontrado",
                    content = @Content(schema = @Schema(implementation = ProductoResponse.class))),
            @ApiResponse(responseCode = "404", description = "No existe un producto con ese código", content = @Content)
    })
    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ProductoResponse> obtenerPorCodigo(
            @Parameter(description = "Código único del producto", example = "FER-001") @PathVariable String codigo) {
        return productoRepository.findByCodigo(codigo)
                .map(p -> ResponseEntity.ok(toResponse(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crear producto", description = "Registra un nuevo producto en el catálogo. Requiere rol Administrador.")
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME_NAME)
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Producto creado",
                    content = @Content(schema = @Schema(implementation = ProductoResponse.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol Administrador", content = @Content)
    })
    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@RequestBody ProductoRequest req) {
        Producto p = new Producto();
        apply(p, req);
        Producto saved = productoRepository.save(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @Operation(summary = "Actualizar producto", description = "Reemplaza los datos de un producto existente. Requiere rol Administrador.")
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME_NAME)
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Producto actualizado",
                    content = @Content(schema = @Schema(implementation = ProductoResponse.class))),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol Administrador", content = @Content),
            @ApiResponse(responseCode = "404", description = "No existe un producto con ese ID", content = @Content)
    })
    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> actualizar(
            @Parameter(description = "ID interno del producto", example = "1") @PathVariable Long id,
            @RequestBody ProductoRequest req) {
        return productoRepository.findById(id).map(p -> {
            apply(p, req);
            return ResponseEntity.ok(toResponse(productoRepository.save(p)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Eliminar producto", description = "Elimina un producto del catálogo. Requiere rol Administrador.")
    @SecurityRequirement(name = OpenApiConfig.SECURITY_SCHEME_NAME)
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Producto eliminado", content = @Content),
            @ApiResponse(responseCode = "401", description = "No autenticado", content = @Content),
            @ApiResponse(responseCode = "403", description = "El usuario no tiene rol Administrador", content = @Content),
            @ApiResponse(responseCode = "404", description = "No existe un producto con ese ID", content = @Content)
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(
            @Parameter(description = "ID interno del producto", example = "1") @PathVariable Long id) {
        if (!productoRepository.existsById(id)) return ResponseEntity.notFound().build();
        productoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void apply(Producto p, ProductoRequest req) {
        p.setCodigo(req.codigo());
        p.setNombre(req.nombre());
        p.setCategoria(req.categoria());
        p.setPrecio(req.precio());
        p.setStock(req.stock());
        p.setDescripcion(req.descripcion());
        p.setActivo(req.activo() != null ? req.activo() : true);
    }

    private ProductoResponse toResponse(Producto p) {
        return new ProductoResponse(
                p.getId(), p.getCodigo(), p.getNombre(), p.getCategoria(),
                p.getPrecio(), p.getStock(), p.getDescripcion(), p.getActivo()
        );
    }
}
