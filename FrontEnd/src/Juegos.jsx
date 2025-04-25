import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext"; // Importar el contexto de autenticación
import "./Juego.css";
import { URL_BACKEND } from "./config";

const Juegos = () => {
  const { user, logout } = useAuth(); // Usar el contexto de autenticación
  const [juegos, setJuegos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [precio, setPrecio] = useState("");
  const [img, setImg] = useState(null);
  const [editando, setEditando] = useState(false);
  const [juegoEditando, setJuegoEditando] = useState(null);
  const [searchNombre, setSearchNombre] = useState("");
  const [searchCategoria, setSearchCategoria] = useState("");
  const [modalAlert, setModalAlert] = useState(false);
  const [juegoEliminar, setJuegoEliminar] = useState(null);

  const opeNModal = (juego) => {
    setJuegoEliminar(juego.id);
    setModalAlert(true);
  };
  const cerrarModal = () => {
    setModalAlert(false);
    setJuegoEliminar(null);
  };

  const confirmarEliminacion = async () => {
    try {
      await axios.delete(`${URL_BACKEND}/juegos/eliminar/${juegoEliminar}`);
      setJuegos((prevJuegos) =>
        prevJuegos.filter((juego) => juego.id !== juegoEliminar)
      );
      cerrarModal(); // Cerrar el modal después de eliminar
    } catch (error) {
      console.error("Error al eliminar el juego:", error);
      alert("Error al eliminar el juego. Por favor, inténtalo de nuevo.");
    }
  };

  const modal = (
    <div className="modal">
      <div className="modal-overlay" onClick={cerrarModal}></div>
      <div className="modal-content">
        <h2 className="modal-title">
          ¿Seguro que quieres eliminar este juego?
        </h2>
        <p className="modal-message">Esta acción no se puede deshacer.</p>
        <div
          className="modal-buttons-container"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <button className="modal-button" onClick={confirmarEliminacion}>
            Eliminar
          </button>
          <button className="modal-button" onClick={cerrarModal}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    if (!user) return;

    const fetchJuegos = async () => {
      try {
        const response = await axios.get(`${URL_BACKEND}/juegos`);
        setJuegos(response.data);
      } catch (error) {
        console.error("Error al obtener los juegos:", error);
      }
    };
    fetchJuegos();
  }, [user]);

  // Manejar el envío del formulario (crear o editar juego)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("categoria", categoria);
    formData.append("precio", parseFloat(precio));
    if (img) formData.append("img", img);

    try {
      console.log("FormData", formData.get("img"));
      if (editando) {
        const response = await axios.put(
          `${URL_BACKEND}/juegos/editar/${juegoEditando.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          // Actualizar la lista de juegos
          const updatedJuegos = juegos.map((juego) =>
            juego.id === juegoEditando.id ? response.data : juego
          );
          setJuegos(updatedJuegos);

          window.location.reload();
          // Limpiar el formulario
          setNombre("");
          setCategoria("");
          setPrecio("");
          setImg(null);
          setEditando(false);
          setJuegoEditando(null);
        } else {
          alert("Error al actualizar el juego: " + response.data);
        }
      } else {
        const response = await axios.post(
          `${URL_BACKEND}/juegos/crear`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setJuegos((prevJuegos) => [...prevJuegos, response.data]);
      }

      // Limpiar el formulario
      setNombre("");
      setCategoria("");
      setPrecio("");
      setImg(null);
      setEditando(false);
      setJuegoEditando(null);
    } catch (error) {
      console.error("Error al guardar el juego:", error);
      const errorMessage =
        error.response?.data ||
        "Error al guardar el juego. Por favor, verifica los datos y vuelve a intentarlo.";
      alert(errorMessage);
    }
  };

  // Manejar el cambio de imagen
  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
    console.log("target", e.target.files[0]);
  };

  // Manejar la edición de un juego
  const handleEdit = (juego) => {
    setNombre(juego.nombre);
    setCategoria(juego.categoria);
    setPrecio(juego.precio);
    setJuegoEditando(juego);
    setEditando(true);
    setImg(null);
  };

  // Cancelar la edición
  const handleCancelEdit = () => {
    setEditando(false);
    setJuegoEditando(null);
    setNombre("");
    setCategoria("");
    setPrecio("");
    setImg(null);
  };

  // Manejar la eliminación de un juego
  const handleDelete = async (id) => {
    try {
      // El id se maneja como string para MongoDB
      await axios.delete(`${URL_BACKEND}/juegos/eliminar/${id}`);
      setJuegos((prevJuegos) => prevJuegos.filter((juego) => juego.id !== id));
    } catch (error) {
      console.error("Error al eliminar el juego:", error);
      alert("Error al eliminar el juego. Por favor, inténtalo de nuevo.");
    }
  };

  // Manejar el cierre de sesión
  const handleLogout = () => {
    logout(); // Usar la función logout del contexto
  };

  // Filtrar juegos según la búsqueda
  const filteredJuegos = juegos.filter((juego) => {
    return (
      juego.nombre.toLowerCase().includes(searchNombre.toLowerCase()) &&
      juego.categoria.toLowerCase().includes(searchCategoria.toLowerCase())
    );
  });

  return (
    <div className="juegos-container">
      {modalAlert && modal}
      <nav className="juegos-navbar">
        <h1 className="juegos-title">Bienvenido a la Tienda de Juegos</h1>
        <div className="juegos-navbar-actions">
          <div className="juegos-search-container">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchNombre}
              onChange={(e) => setSearchNombre(e.target.value)}
              className="juegos-search-input"
            />
            <input
              type="text"
              placeholder="Buscar por categoría..."
              value={searchCategoria}
              onChange={(e) => setSearchCategoria(e.target.value)}
              className="juegos-search-input"
            />
          </div>
          <button onClick={handleLogout} className="juegos-logout-button">
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <div className="juegos-content">
        <div className="juegos-add-game-form">
          <h2 className="juegos-form-title">
            {editando ? "Editar Juego" : "Agregar Nuevo Juego"}
          </h2>
          <form onSubmit={handleSubmit} className="juegos-form">
            <div className="juegos-form-group">
              <label className="juegos-label">Nombre:</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="juegos-input"
                required
              />
            </div>
            <div className="juegos-form-group">
              <label className="juegos-label">Categoría:</label>
              <input
                type="text"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="juegos-input"
                required
              />
            </div>
            <div className="juegos-form-group">
              <label className="juegos-label">Precio:</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                className="juegos-input"
                required
              />
            </div>
            <div className="juegos-form-group">
              <label className="juegos-label">Imagen:</label>
              <input
                type="file"
                onChange={handleImageChange}
                className="juegos-input"
                accept="image/*"
              />
            </div>
            <button type="submit" className="juegos-submit-button">
              {editando ? "Actualizar Juego" : "Agregar Juego"}
            </button>
            {editando && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="juegos-cancel-button"
              >
                Cancelar
              </button>
            )}
          </form>
        </div>

        <div className="juegos-games-list">
          <h3 className="juegos-list-title">Lista de Juegos</h3>
          <ul className="juegos-list">
            {filteredJuegos.map((juego) => (
              <li key={juego.id} className="juegos-game-item">
                <span className="juegos-game-name">{juego.nombre}</span>
                <span className="juegos-game-category">{juego.categoria}</span>
                <span className="juegos-game-price">${juego.precio}</span>
                {juego.img && (
                  <img
                    src={`${URL_BACKEND}/juegos/imagen/${juego.id}`}
                    alt={juego.nombre}
                    className="juegos-game-image"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                )}
                <div className="botones">
                  <button
                    onClick={() => handleEdit(juego)}
                    className="juegos-edit-button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => opeNModal(juego)}
                    className="juegos-delete-button"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Juegos;
