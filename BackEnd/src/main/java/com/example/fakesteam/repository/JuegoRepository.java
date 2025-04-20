package com.example.fakesteam.repository;

import com.example.fakesteam.entity.Juego;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface JuegoRepository extends MongoRepository<Juego, Long> {
    List<Juego> findByNombreContaining(String nombre);
    List<Juego> findByCategoria(String categoria);
}