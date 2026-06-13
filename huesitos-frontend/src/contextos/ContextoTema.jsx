import { createContext, useContext, useEffect, useState } from 'react';
import { actualizarTemaUsuario } from '../api/perfilApi';

const ContextoTema = createContext(null);

export const ProveedorTema = ({ children }) => {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('tema') || 'claro';
  });

  useEffect(() => {
    const raiz = document.documentElement;
    if (tema === 'oscuro') {
      raiz.classList.add('dark');
    } else {
      raiz.classList.remove('dark');
    }
    localStorage.setItem('tema', tema);
  }, [tema]);

  const alternarTema = async () => {
    const nuevoTema = tema === 'claro' ? 'oscuro' : 'claro';
    setTema(nuevoTema);

    const usuarioId = localStorage.getItem('usuarioId');
    if (usuarioId) {
      try {
        await actualizarTemaUsuario(usuarioId, nuevoTema);
      } catch (error) {
        console.error('Error al guardar tema en backend:', error);
      }
    }
  };

  const cambiarTema = async (nuevoTema) => {
    if (nuevoTema !== 'claro' && nuevoTema !== 'oscuro') return;
    setTema(nuevoTema);

    const usuarioId = localStorage.getItem('usuarioId');
    if (usuarioId) {
      try {
        await actualizarTemaUsuario(usuarioId, nuevoTema);
      } catch (error) {
        console.error('Error al guardar tema en backend:', error);
      }
    }
  };

  return (
    <ContextoTema.Provider value={{ tema, alternarTema, cambiarTema }}>
      {children}
    </ContextoTema.Provider>
  );
};

export const useTema = () => {
  const ctx = useContext(ContextoTema);
  if (!ctx) throw new Error('useTema debe usarse dentro de ProveedorTema');
  return ctx;
};
