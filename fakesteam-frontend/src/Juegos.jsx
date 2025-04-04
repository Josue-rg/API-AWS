import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Importar el contexto de autenticación
import './Juego.css';

const Juegos = () => {
  const { user, logout } = useAuth(); // Usar el contexto de autenticación
  const [juegos, setJuegos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [img, setImg] = useState(null);
  const [editando, setEditando] = useState(false);
  const [juegoEditando, setJuegoEditando] = useState(null);
  const [searchNombre, setSearchNombre] = useState('');
  const [searchCategoria, setSearchCategoria] = useState('');

  // Obtener la lista de juegos al cargar el componente
  useEffect(() => {
    if (!user) return; // Si no hay usuario, no hacer la petición

    const fetchJuegos = async () => {
      try {
        const response = await axios.get('http://localhost:8080/juegos');
        setJuegos(response.data);
      } catch (error) {
        console.error('Error al obtener los juegos:', error);
      }
    };
    fetchJuegos();
  }, [user]);

  // Manejar el envío del formulario (crear o editar juego)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', nombre);
    formData.append('categoria', categoria);
    formData.append('precio', parseFloat(precio));
    if (img) formData.append('img', img);

    try {
      if (editando) {
        // Usamos el id como string para MongoDB
        await axios.put(`http://localhost:8080/juegos/editar/${juegoEditando.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        window.location.reload(); // Recargar la página después de editar
      } else {
        const response = await axios.post('http://localhost:8080/juegos/crear', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setJuegos((prevJuegos) => [...prevJuegos, response.data]);
      }

      // Limpiar el formulario
      setNombre('');
      setCategoria('');
      setPrecio('');
      setImg(null);
      setEditando(false);
      setJuegoEditando(null);
    } catch (error) {
      console.error('Error al guardar el juego:', error.response ? error.response.data : error.message);
      alert('Error al guardar el juego. Por favor, verifica los datos y vuelve a intentarlo.');
    }
  };

  // Manejar el cambio de imagen
  const handleImageChange = (e) => {
    setImg(e.target.files[0]);
  };

  // Manejar la edición de un juego
  const handleEdit = (juego) => {
    setNombre(juego.nombre);
    setCategoria(juego.categoria);
    setPrecio(juego.precio);
    setJuegoEditando(juego);
    setEditando(true);
  };

  // Cancelar la edición
  const handleCancelEdit = () => {
    setEditando(false);
    setJuegoEditando(null);
    setNombre('');
    setCategoria('');
    setPrecio('');
    setImg(null);
  };

  // Manejar la eliminación de un juego
  const handleDelete = async (id) => {
    try {
      // El id se maneja como string para MongoDB
      await axios.delete(`http://localhost:8080/juegos/eliminar/${id}`);
      setJuegos((prevJuegos) => prevJuegos.filter((juego) => juego.id !== id));
    } catch (error) {
      console.error('Error al eliminar el juego:', error);
      alert('Error al eliminar el juego. Por favor, inténtalo de nuevo.');
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
          <h2 className="juegos-form-title">{editando ? 'Editar Juego' : 'Agregar Nuevo Juego'}</h2>
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
              />
            </div>
            <button type="submit" className="juegos-submit-button">
              {editando ? 'Actualizar Juego' : 'Agregar Juego'}
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
                    src={`http://localhost:8080/juegos/imagen/${juego.id}`}
                    alt={juego.nombre}
                    className="juegos-game-image"
                  />
                )}
                <div className='botones'>
                  <button
                    onClick={() => handleEdit(juego)}
                    className="juegos-edit-button"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(juego.id)}
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