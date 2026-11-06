package com.stackertriple.ferreterialosmaestros.controller.v1;

import com.stackertriple.ferreterialosmaestros.dto.request.ProductoRequest;
import com.stackertriple.ferreterialosmaestros.dto.response.ProductoResponse;
import com.stackertriple.ferreterialosmaestros.model.entity.Producto;
import com.stackertriple.ferreterialosmaestros.repository.ProductoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {

    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<ProductoResponse> listar() {
        return productoRepository.findAll().stream().map(this::toResponse).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponse> obtener(@PathVariable Long id) {
        return productoRepository.findById(id)
                .map(p -> ResponseEntity.ok(toResponse(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/codigo/{codigo}")
    public ResponseEntity<ProductoResponse> obtenerPorCodigo(@PathVariable String codigo) {
        return productoRepository.findByCodigo(codigo)
                .map(p -> ResponseEntity.ok(toResponse(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductoResponse> crear(@RequestBody ProductoRequest req) {
        Producto p = new Producto();
        apply(p, req);
        Producto saved = productoRepository.save(p);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductoResponse> actualizar(@PathVariable Long id, @RequestBody ProductoRequest req) {
        return productoRepository.findById(id).map(p -> {
            apply(p, req);
            return ResponseEntity.ok(toResponse(productoRepository.save(p)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
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
