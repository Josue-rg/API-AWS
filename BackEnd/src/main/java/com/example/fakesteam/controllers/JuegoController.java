package com.example.fakesteam.controllers;

import com.example.fakesteam.entity.Juego;
import com.example.fakesteam.repository.JuegoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.StringUtils;
import org.springframework.http.ResponseEntity;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/juegos")
public class JuegoController {

    @Autowired
    private JuegoRepository repository;

    // Obtener todos los juegos
    @GetMapping
    public List<Juego> getAll() {
        return repository.findAll();
    }

    @PostMapping("/crear")
    public ResponseEntity<Juego> create(
            @RequestParam("nombre") String nombre,
            @RequestParam("precio") double precio,
            @RequestParam("categoria") String categoria,
            @RequestParam(value = "img", required = false) MultipartFile file) {
        try {
            Juego juego = new Juego();
            juego.setNombre(nombre);
            juego.setPrecio(precio);
            juego.setCategoria(categoria);

            if (file != null && !file.isEmpty()) {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                byte[] imgBytes = file.getBytes();

                // Crear la carpeta si no existe
                Path path = Paths.get("imagenes/");
                if (!Files.exists(path)) {
                    Files.createDirectories(path);
                }

                Path filePath = Paths.get("imagenes/" + fileName);
                Files.write(filePath, imgBytes);
                juego.setImg(imgBytes);
            } else {
                juego.setImg(null);
            }

            Juego savedJuego = repository.save(juego);
            return ResponseEntity.status(201).body(savedJuego);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Juego> updateJuego(
            @PathVariable long id,
            @RequestParam("nombre") String nombre,
            @RequestParam("precio") double precio,
            @RequestParam("categoria") String categoria,
            @RequestParam(value = "img", required = false) MultipartFile file) {
        try {
            Juego juego = repository.findById(id).orElseThrow(() -> new RuntimeException("Juego no encontrado"));

            juego.setNombre(nombre);
            juego.setPrecio(precio);
            juego.setCategoria(categoria);

            if (file != null && !file.isEmpty()) {
                String fileName = StringUtils.cleanPath(file.getOriginalFilename());
                byte[] imgBytes = file.getBytes();

                // Crear la carpeta si no existe
                Path path = Paths.get("imagenes/");
                if (!Files.exists(path)) {
                    Files.createDirectories(path);
                }

                Path filePath = Paths.get("imagenes/" + fileName);
                Files.write(filePath, imgBytes);
                juego.setImg(imgBytes);
            } // Si no se proporciona una nueva imagen, no se cambia la imagen existente

            Juego updatedJuego = repository.save(juego);
            return ResponseEntity.status(200).body(updatedJuego);
        } catch (IOException e) {
            return ResponseEntity.status(500).body(null);
        }
    }

    @DeleteMapping("/eliminar/{id}")
    public ResponseEntity<Void> deleteJuego(@PathVariable long id) {
        try {
            Juego juego = repository.findById(id).orElseThrow(() -> new RuntimeException("Juego no encontrado"));
            repository.delete(juego);
            return ResponseEntity.status(204).build(); // 204 No Content
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @GetMapping("/imagen/{id}")
    public ResponseEntity<byte[]> getImagen(@PathVariable long id) {
        Juego juego = repository.findById(id).orElseThrow(() -> new RuntimeException("Juego no encontrado"));
        return ResponseEntity.ok().body(juego.getImg());
    }
}