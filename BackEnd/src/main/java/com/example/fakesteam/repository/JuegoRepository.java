package com.example.fakesteam.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.fakesteam.entity.Juego;

public interface JuegoRepository extends MongoRepository<Juego, String> {
    List<Juego> findByNombreContaining(String nombre);
    List<Juego> findByCategoria(String categoria);
}