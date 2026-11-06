package com.stackertriple.ferreterialosmaestros.dto.request;

public record LoginRequest(
        String usuario,
        String username,
        String password
) {
    public String resolvedUsername() {
        return (username != null && !username.isBlank()) ? username : usuario;
    }
}
