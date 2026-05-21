import { useState } from 'react';

const App = () => {
  const [contador, setContador] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans selection:bg-violet-500 selection:text-white">
      {/* Encabezado */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🦴</span>
            <span className="font-extrabold text-xl bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Huesitos
            </span>
          </div>
          <nav className="flex items-center gap-6">
            <a 
              href="https://github.com/PaulBendezuTorres/huesitos-web-app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-950/40 via-slate-950 to-slate-950">
        <div className="max-w-3xl w-full text-center space-y-8">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse"></span>
              Frontend Inicializado con Éxito
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white">
              Proyecto{" "}
              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-500 bg-clip-text text-transparent">
                Huesitos
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-400">
              Aplicación web moderna construida con React 18, Tailwind CSS y empaquetada con la velocidad de Vite.
            </p>
          </div>

          {/* Sección Interactiva */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 max-w-md mx-auto backdrop-blur-sm shadow-xl">
            <h2 className="text-lg font-bold text-slate-200 mb-4">Prueba de Estado React</h2>
            <p className="text-sm text-slate-400 mb-6">
              Haz clic en el botón para probar la interactividad del estado local en React.
            </p>
            <div className="space-y-4">
              <button
                onClick={() => setContador((anterior) => anterior + 1)}
                className="w-full py-3 px-6 rounded-xl font-bold bg-violet-600 hover:bg-violet-500 active:scale-95 text-white transition-all shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 flex items-center justify-center gap-2"
              >
                Incrementar Contador
              </button>
              <div className="text-slate-300 text-sm font-semibold">
                Valor actual: <span className="text-violet-400 text-base font-bold bg-violet-500/10 px-2 py-1 rounded border border-violet-500/20">{contador}</span>
              </div>
            </div>
          </div>

          {/* Tecnologías */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-8">
            <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/60 text-center">
              <div className="text-2xl mb-1">⚛️</div>
              <div className="text-xs text-slate-500">Frontend</div>
              <div className="text-sm font-bold text-slate-300">React 18</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/60 text-center">
              <div className="text-2xl mb-1">🎨</div>
              <div className="text-xs text-slate-500">Estilos</div>
              <div className="text-sm font-bold text-slate-300">Tailwind 3.4</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/60 text-center">
              <div className="text-2xl mb-1">🍃</div>
              <div className="text-xs text-slate-500">Backend</div>
              <div className="text-sm font-bold text-slate-300">Spring Boot 4</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/20 border border-slate-800/60 text-center">
              <div className="text-2xl mb-1">🐬</div>
              <div className="text-xs text-slate-500">Base de Datos</div>
              <div className="text-sm font-bold text-slate-300">MySQL 8.4</div>
            </div>
          </div>
        </div>
      </main>

      {/* Pie de Página */}
      <footer className="border-t border-slate-800 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} Proyecto Huesitos. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
