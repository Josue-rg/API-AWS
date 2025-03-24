package com.example.fakesteam.repository;

import com.example.fakesteam.entity.Juego;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JuegoRepository extends JpaRepository<Juego, Long> {
    List<Juego> findByNombreContaining(String nombre);
    List<Juego> findByCategoria(String categoria);
}
