package com.example.fakesteam.config;

import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<String> handleDataAccessException(DataAccessException ex) {
        return ResponseEntity
            .status(500)
            .body("Error de acceso a datos: " + ex.getMessage() + 
                  "\nCausa: " + (ex.getCause() != null ? ex.getCause().getMessage() : "Desconocida"));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception ex) {
        return ResponseEntity
            .status(500)
            .body("Error: " + ex.getMessage());
    }
} 