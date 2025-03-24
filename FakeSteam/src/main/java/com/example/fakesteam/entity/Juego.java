package com.example.fakesteam.entity;

import jakarta.persistence.*;

@Entity
public class Juego {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nombre;
    private double precio;
    @Lob
    private byte[] img;  // Usamos byte[] para almacenar la imagen en formato binario

    private String categoria;
    public Juego() {}

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
