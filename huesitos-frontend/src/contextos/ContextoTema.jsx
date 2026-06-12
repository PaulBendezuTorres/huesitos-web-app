import { createContext, useContext, useEffect, useState } from 'react';

const ContextoTema = createContext(null);

export const ProveedorTema = ({ children }) => {
  const [tema, setTema] = useState(() => {
    return localStorage.getItem('tema') || 'oscuro';
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

  const alternarTema = () => {
    setTema(prev => prev === 'oscuro' ? 'claro' : 'oscuro');
  };

  return (
    <ContextoTema.Provider value={{ tema, alternarTema }}>
      {children}
    </ContextoTema.Provider>
  );
};

export const useTema = () => {
  const ctx = useContext(ContextoTema);
  if (!ctx) throw new Error('useTema debe usarse dentro de ProveedorTema');
  return ctx;
};
