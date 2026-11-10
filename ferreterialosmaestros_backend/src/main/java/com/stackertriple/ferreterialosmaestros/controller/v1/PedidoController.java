package com.stackertriple.ferreterialosmaestros.controller.v1;

import com.stackertriple.ferreterialosmaestros.model.entity.DetallePedido;
import com.stackertriple.ferreterialosmaestros.model.entity.Pedido;
import com.stackertriple.ferreterialosmaestros.model.entity.Usuario;
import com.stackertriple.ferreterialosmaestros.repository.PedidoRepository;
import com.stackertriple.ferreterialosmaestros.repository.ProductoRepository;
import com.stackertriple.ferreterialosmaestros.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/v1/pedidos")
public class PedidoController {

    private final PedidoRepository pedidoRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public PedidoController(PedidoRepository pedidoRepository, UsuarioRepository usuarioRepository, ProductoRepository productoRepository) {
        this.pedidoRepository = pedidoRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Map<String, Object>> listar() {
        return pedidoRepository.findAll().stream()
                .filter(this::puedeVer)
                .sorted(Comparator.comparing(Pedido::getId).reversed())
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> obtener(@PathVariable Long id) {
        return pedidoRepository.findById(id)
                .filter(this::puedeVer)
                .map(p -> ResponseEntity.ok(toResponse(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/folio/{folio}")
    public ResponseEntity<Map<String, Object>> obtenerPorFolio(@PathVariable String folio) {
        return pedidoRepository.findByFolio(folio)
                .filter(this::puedeVer)
                .map(p -> ResponseEntity.ok(toResponse(p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @SuppressWarnings("unchecked")
    public ResponseEntity<Map<String, Object>> crear(@RequestBody Map<String, Object> req) {
        Pedido p = new Pedido();
        String folio = str(req.get("folio"));
        if (folio == null || folio.isBlank()) folio = "PED-" + System.currentTimeMillis();
        p.setFolio(folio);
        p.setCliente(str(req.get("cliente")));
        p.setEstado(str(req.get("estado")) != null ? str(req.get("estado")) : "pendiente");
        p.setEntrega(str(req.get("entrega")));
        p.setDireccionDespacho(str(req.get("direccionDespacho")));
        p.setMetodoPago(str(req.get("metodoPago")));
        p.setEstadoPago(str(req.get("estadoPago")));
        p.setOrigen(str(req.get("origen")));
        p.setSubtotal(toDecimal(req.get("subtotal")));
        p.setDescuento(toDecimal(req.get("descuento")));
        p.setTotal(toDecimal(req.get("total")));
        p.setFecha(LocalDateTime.now());

        String username = str(req.get("usuario"));
        if (username != null) {
            usuarioRepository.findByUsername(username).ifPresent(p::setUsuario);
        }

        Object productosObj = req.get("productos");
        if (productosObj instanceof List<?> items) {
            for (Object it : items) {
                if (!(it instanceof Map<?, ?> raw)) continue;
                Map<String, Object> m = (Map<String, Object>) raw;
                DetallePedido d = new DetallePedido();
                d.setPedido(p);
                String codigo = str(m.get("codigo"));
                if (codigo != null) {
                    productoRepository.findByCodigo(codigo).ifPresent(d::setProducto);
                }
                d.setCantidad(toInt(m.get("cantidad")));
                d.setPrecioUnitario(toDecimal(m.get("precioUnitario")));
                d.setSubtotal(toDecimal(m.get("subtotal")));
                p.getDetalles().add(d);
            }
        }

        Pedido saved = pedidoRepository.save(p);
        // Preserve extra frontend fields in response where useful
        Map<String, Object> resp = toResponse(saved);
        if (req.get("rol") != null) resp.put("rol", req.get("rol"));
        if (req.get("tipoTarifa") != null) resp.put("tipoTarifa", req.get("tipoTarifa"));
        return ResponseEntity.status(HttpStatus.CREATED).body(resp);
    }

    private Map<String, Object> toResponse(Pedido p) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", p.getId());
        m.put("folio", p.getFolio());
        m.put("cliente", p.getCliente());
        m.put("usuario", p.getUsuario() != null ? p.getUsuario().getUsername() : null);
        m.put("rol", p.getUsuario() != null && p.getUsuario().getRol() != null ? switch (p.getUsuario().getRol()) {
            case ADMINISTRADOR -> "Administrador";
            case VENDEDOR -> "Vendedor";
            case CLIENTE -> "Cliente";
        } : null);
        m.put("fecha", p.getFecha() != null ? p.getFecha().toString() : null);
        m.put("estado", p.getEstado());
        m.put("entrega", p.getEntrega());
        m.put("direccionDespacho", p.getDireccionDespacho());
        m.put("metodoPago", p.getMetodoPago());
        m.put("estadoPago", p.getEstadoPago());
        m.put("subtotal", p.getSubtotal());
        m.put("descuento", p.getDescuento());
        m.put("total", p.getTotal());
        m.put("origen", p.getOrigen());
        List<Map<String, Object>> productos = new ArrayList<>();
        if (p.getDetalles() != null) {
            for (DetallePedido d : p.getDetalles()) {
                Map<String, Object> it = new LinkedHashMap<>();
                it.put("codigo", d.getProducto() != null ? d.getProducto().getCodigo() : null);
                it.put("producto", d.getProducto() != null ? d.getProducto().getNombre() : null);
                it.put("cantidad", d.getCantidad());
                it.put("precioUnitario", d.getPrecioUnitario());
                it.put("subtotal", d.getSubtotal());
                productos.add(it);
            }
        }
        m.put("productos", productos);
        return m;
    }

    // --- Reglas por rol (EP3): Administrador/Vendedor ven todo; Cliente solo sus pedidos ---
    private boolean puedeVer(Pedido p) {
        if (!esClienteActual()) return true;
        String actual = usernameActual();
        return p.getUsuario() != null && actual != null && actual.equals(p.getUsuario().getUsername());
    }

    private boolean esClienteActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_CLIENTE".equals(a.getAuthority()));
    }

    private String usernameActual() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth != null ? auth.getName() : null;
    }

    private String str(Object o) { return o == null ? null : String.valueOf(o); }
    private Integer toInt(Object o) {
        if (o == null) return null;
        if (o instanceof Number n) return n.intValue();
        try { return Integer.parseInt(String.valueOf(o)); } catch (Exception e) { return null; }
    }
    private BigDecimal toDecimal(Object o) {
        if (o == null) return null;
        if (o instanceof BigDecimal b) return b;
        if (o instanceof Number n) return BigDecimal.valueOf(n.doubleValue());
        try { return new BigDecimal(String.valueOf(o)); } catch (Exception e) { return null; }
    }
}
