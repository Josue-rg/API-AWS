import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import './Login.css';
import { URL_BACKEND } from './config';

const Login = () => {
  const { login } = useAuth();
  const [correo, setCorreo] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [error, setError] = useState('');
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [correoRegistro, setCorreoRegistro] = useState('');
  const [contraseñaRegistro, setContraseñaRegistro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${URL_BACKEND}/usuarios/login`, {
        correo,
        contraseña,
      });
      
      // Con MongoDB, asegúrate de que la respuesta de usuario 
      // sea tratada correctamente, incluso con el ID como string
      login(response.data);
    } catch (err) {
      setError('Usuario no encontrado o credenciales incorrectas');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${URL_BACKEND}/usuarios`, {
        nombre: nombreRegistro,
        correo: correoRegistro,
        contraseña: contraseñaRegistro,
      });
      
      // Con MongoDB, el ID del usuario se maneja como string
      alert(`Usuario ${response.data.nombre} registrado exitosamente.`);
      setShowRegisterModal(false);
      setNombreRegistro('');
      setCorreoRegistro('');
      setContraseñaRegistro('');
    } catch (err) {
      alert('Error al registrar el usuario. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar Sesión</h2>
        {error && <p className="login-error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-form-group">
            <label htmlFor="correo" className="login-label">
              Correo Electrónico:
            </label>
            <input
              type="email"
              id="correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Ingresa tu correo"
              className="login-input"
              required
            />
          </div>
          <div className="login-form-group">
            <label htmlFor="contraseña" className="login-label">
              Contraseña:
            </label>
            <input
              type="password"
              id="contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="login-input"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
        </form>

        <p className="login-register-link">
          ¿No tienes una cuenta?{' '}
          <a href="#!" onClick={() => setShowRegisterModal(true)}>
            Regístrate aquí
          </a>
        </p>
      </div>

      {showRegisterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="modal-title">Registro de Usuario</h2>
            <form onSubmit={handleRegisterSubmit} className="modal-form">
              <div className="modal-form-group">
                <label htmlFor="nombreRegistro" className="modal-label">
                  Nombre:
                </label>
                <input
                  type="text"
                  id="nombreRegistro"
                  value={nombreRegistro}
                  onChange={(e) => setNombreRegistro(e.target.value)}
                  placeholder="Ingresa tu nombre"
                  className="modal-input"
                  required
                />
              </div>
              <div className="modal-form-group">
                <label htmlFor="correoRegistro" className="modal-label">
                  Correo Electrónico:
                </label>
                <input
                  type="email"
                  id="correoRegistro"
                  value={correoRegistro}
                  onChange={(e) => setCorreoRegistro(e.target.value)}
                  placeholder="Ingresa tu correo"
                  className="modal-input"
                  required
                />
              </div>
              <div className="modal-form-group">
                <label htmlFor="contraseñaRegistro" className="modal-label">
                  Contraseña:
                </label>
                <input
                  type="password"
                  id="contraseñaRegistro"
                  value={contraseñaRegistro}
                  onChange={(e) => setContraseñaRegistro(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="modal-input"
                  required
                />
              </div>
              <button type="submit" className="modal-button">
                Registrarse
              </button>
              <button
                type="button"
                className="modal-close-button"
                onClick={() => setShowRegisterModal(false)}
              >
                Cerrar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;