package com.example.fakesteam.repository;

import com.example.fakesteam.entity.Usuario;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UsuarioRepository extends MongoRepository<Usuario, String> {
    Optional<Usuario> findByCorreoAndContraseña(String correo, String contraseña);
}