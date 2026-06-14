import { Sun, Moon } from 'lucide-react';

const EncabezadoPortada = ({
  config,
  tema,
  alternarTema,
  menuAbierto,
  setMenuAbierto,
  logo
}) => {
  return (
    <header className="bg-white/80 dark:bg-oscuro-base/80 backdrop-blur-xl sticky top-0 z-50 border-b border-slate-200/50 dark:border-oscuro-borde/60 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
        
        {/* Logo y Nombre */}
        <a href="#inicio" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-gradient-to-tr from-sky-500 to-cyan-300 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-sky-400/30 group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 shrink-0">
            <img src={logo} alt="Logo de la clínica" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-xl sm:text-3xl text-slate-900 dark:text-white tracking-tight leading-tight transition-colors">
              {config.nombreNegocio}
            </span>
            <span className="text-[10px] sm:text-xs font-semibold text-blue-600 dark:text-sky-400 tracking-widest uppercase transition-colors">
              Clínica Veterinaria
            </span>
          </div>
        </a>

        {/* Menú Desktop */}
        <nav className="hidden md:flex items-center gap-8 font-medium text-slate-600 dark:text-slate-300 text-sm tracking-wide transition-colors">
          <a href="#inicio" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Inicio</a>
          <a href="#nosotros" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Nosotros</a>
          <a href="#servicios" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Servicios</a>
          <a href="#ubicacion" className="hover:text-blue-600 dark:hover:text-sky-400 transition-colors">Ubicación</a>
          <a href="#emergencias" className="text-red-500 font-bold hover:text-red-650 transition-colors">Emergencias 24/7</a>
        </nav>

        {/* Botones Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Toggle Tema Claro/Oscuro */}
          <button
            onClick={alternarTema}
            title={tema === 'oscuro' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-300 bg-slate-100 dark:bg-oscuro-tarjeta hover:bg-slate-200 dark:hover:bg-oscuro-borde border border-slate-200 dark:border-oscuro-borde/85 shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 group overflow-hidden mr-1"
          >
            <div className="relative z-10 flex items-center justify-center">
              {tema === 'oscuro' ? (
                <Sun size={18} className="text-amber-500 group-hover:rotate-45 transition-transform duration-500" />
              ) : (
                <Moon size={18} className="text-slate-600 group-hover:-rotate-12 transition-transform duration-500" />
              )}
            </div>
          </button>

          <button
            onClick={() => window.location.href = '/registro'}
            className="flex items-center gap-2 border border-slate-200 dark:border-oscuro-borde hover:border-sky-400 text-slate-650 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-0.5 bg-transparent"
          >
            Crear cuenta
          </button>
          <button 
            onClick={() => window.location.href = '/login'}
            className="flex items-center gap-2 bg-gradient-to-tr from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-sky-400/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            Iniciar Sesión
          </button>
        </div>

        {/* Botón Menú Móvil */}
        <button 
          className="md:hidden text-slate-600 dark:text-slate-300 p-2 transition-colors" 
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuAbierto ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuAbierto ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuAbierto ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* MENÚ MÓVIL DESPLEGABLE */}
      {menuAbierto && (
        <div className="md:hidden fixed inset-0 z-40 flex items-start justify-center pt-20 px-4">
          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-[#0B1A30]/60 backdrop-blur-sm" onClick={() => setMenuAbierto(false)} />
          {/* Panel centrado */}
          <div className="relative z-10 w-full max-w-sm bg-white dark:bg-oscuro-secundario rounded-2xl shadow-2xl p-6 flex flex-col gap-1 border border-slate-100 dark:border-oscuro-borde animate-in fade-in slide-in-from-top-4 duration-200">
            <a href="#inicio"      onClick={() => setMenuAbierto(false)} className="text-slate-700 dark:text-slate-200 font-semibold text-sm py-3 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-oscuro-tarjeta hover:text-blue-600 dark:hover:text-sky-400 transition-colors">🏠 Inicio</a>
            <a href="#nosotros"    onClick={() => setMenuAbierto(false)} className="text-slate-700 dark:text-slate-200 font-semibold text-sm py-3 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-oscuro-tarjeta hover:text-blue-600 dark:hover:text-sky-400 transition-colors">ℹ️ Nosotros</a>
            <a href="#servicios"   onClick={() => setMenuAbierto(false)} className="text-slate-700 dark:text-slate-200 font-semibold text-sm py-3 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-oscuro-tarjeta hover:text-blue-600 dark:hover:text-sky-400 transition-colors">🩺 Servicios</a>
            <a href="#ubicacion"   onClick={() => setMenuAbierto(false)} className="text-slate-700 dark:text-slate-200 font-semibold text-sm py-3 px-3 rounded-xl hover:bg-slate-50 dark:hover:bg-oscuro-tarjeta hover:text-blue-600 dark:hover:text-sky-400 transition-colors">📍 Ubicación</a>
            <a href="#emergencias" onClick={() => setMenuAbierto(false)} className="text-red-500 font-bold text-sm py-3 px-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">🚨 Emergencias 24/7</a>
            
            <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-slate-100 dark:border-oscuro-borde">
              {/* Alternar Tema Móvil */}
              <button
                onClick={alternarTema}
                className="w-full py-2.5 px-4 bg-slate-100 dark:bg-oscuro-tarjeta text-slate-700 dark:text-slate-200 font-semibold rounded-xl flex items-center justify-between transition-all text-sm border border-slate-200 dark:border-oscuro-borde"
              >
                <span className="flex items-center gap-2">
                  {tema === 'oscuro' ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
                </span>
                <span className="text-xs text-slate-400 capitalize">{tema}</span>
              </button>

              <button
                onClick={() => { setMenuAbierto(false); window.location.href = '/login'; }}
                className="w-full py-2.5 bg-gradient-to-tr from-sky-500 to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-sky-400/30 hover:from-sky-600 hover:to-cyan-500 transition-all text-sm"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => { setMenuAbierto(false); window.location.href = '/registro'; }}
                className="w-full py-2.5 border border-slate-200 dark:border-oscuro-borde text-slate-655 dark:text-slate-300 font-semibold rounded-xl hover:border-sky-400 hover:text-sky-600 transition-all text-sm"
              >
                Crear cuenta
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default EncabezadoPortada;
