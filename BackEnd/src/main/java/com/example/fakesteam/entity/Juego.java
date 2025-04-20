package com.example.fakesteam.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "juegos")
public class Juego {
    @Id
    private Long id;
    private String nombre;
    private double precio;
    private byte[] img;
    private String categoria;

    public Juego() {}

    public Juego(Long id, String nombre, double precio, byte[] img, String categoria) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.img = img;
        this.categoria = categoria;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public double getPrecio() { return precio; }
    public void setPrecio(double precio) { this.precio = precio; }

    public byte[] getImg() { return img; }
    public void setImg(byte[] img) { this.img = img; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
}