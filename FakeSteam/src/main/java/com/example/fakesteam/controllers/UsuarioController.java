package com.example.fakesteam.controllers;

import com.example.fakesteam.entity.Usuario;
import com.example.fakesteam.repository.UsuarioRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioRepository repository;

    @PostMapping
    public Usuario register(@RequestBody Usuario usuario) {
        return repository.save(usuario);
    }

    @PutMapping("/{id}")
    public Usuario update(@PathVariable String id, @RequestBody Usuario usuario) {
        usuario.setId(id);
        return repository.save(usuario);
    }

    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario usuario) {
        return repository.findByCorreoAndContraseña(usuario.getCorreo(), usuario.getContraseña())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado o credenciales incorrectas"));
    }
}