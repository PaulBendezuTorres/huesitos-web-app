import { motion } from 'framer-motion';
import { ShieldPlus, Activity, Stethoscope } from 'lucide-react';

const SeccionHero = ({
  fadeUp,
  portada,
  config
}) => {
  return (
    <motion.section
      id="inicio"
      className="relative pt-28 sm:pt-36 pb-32 sm:pb-48 flex items-center justify-center overflow-hidden bg-cover bg-center min-h-[70vh]"
      variants={fadeUp}
      style={{ backgroundImage: `url(${portada})` }}
    >
      <div className="absolute inset-0 bg-[#0B132B]/75 z-0"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6 sm:space-y-10 relative z-10 text-white animate-in fade-in zoom-in-95 duration-700">
        <div className="inline-flex items-center gap-2 py-1.5 px-3 sm:py-2 sm:px-4 rounded-full bg-blue-500/20 text-blue-300 text-xs sm:text-sm font-bold tracking-wide border border-blue-500/30 backdrop-blur-md shadow-sm">
          <ShieldPlus size={14} />
          <span>Medicina veterinaria de vanguardia</span>
        </div>
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black leading-[1.1] tracking-tight text-white drop-shadow-sm">
          Excelencia médica para{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
            quienes más amas
          </span>
        </h1>
        <p className="text-sm sm:text-lg md:text-xl text-slate-200 max-w-3xl mx-auto leading-relaxed drop-shadow px-2">
          Las consultas médicas nos ayudan a monitorear el estado de salud de tu mascota. Contamos con tecnología de vanguardia y especialistas dedicados en la clínica {config.nombreNegocio}.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3 sm:gap-6">
          <div className="flex items-center justify-center gap-3 text-white font-medium bg-white/10 backdrop-blur-md px-5 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-sm border border-white/10 text-sm sm:text-base">
            <Activity className="text-sky-300 shrink-0" size={18} />
            Laboratorio Propio 24h
          </div>
          <div className="flex items-center justify-center gap-3 text-white font-medium bg-white/10 backdrop-blur-md px-5 py-3 sm:px-6 sm:py-4 rounded-2xl shadow-sm border border-white/10 text-sm sm:text-base">
            <Stethoscope className="text-sky-300 shrink-0" size={18} />
            Especialistas Certificados
          </div>
        </div>
        {/* Botones CTA en hero */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
          <button
            onClick={() => window.location.href = '/registro'}
            className="px-7 py-3 bg-white text-sky-700 hover:text-sky-800 font-bold rounded-xl shadow-lg hover:bg-sky-50 transition-all text-sm sm:text-base"
          >
            Crear cuenta gratis
          </button>
          <button
            onClick={() => window.location.href = '/login'}
            className="px-7 py-3 bg-sky-600/80 hover:bg-sky-600 text-white font-bold rounded-xl border border-sky-400/40 backdrop-blur-sm transition-all text-sm sm:text-base"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default SeccionHero;
