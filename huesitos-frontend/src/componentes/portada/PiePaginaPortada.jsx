import { HeartPulse, Phone, Mail, Activity } from 'lucide-react';

const PiePaginaPortada = ({
  fadeUp,
  config,
  iconoFacebook,
  iconoInstagram,
  iconoTwitter,
  iconoYoutube
}) => {
  return (
    <footer className="bg-[#070C1D] text-slate-400 border-t border-[#182854]/30 relative overflow-hidden transition-all duration-300">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* 1. Info Principal de Marca */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <HeartPulse size={32} className="text-blue-500" />
              <span className="font-extrabold text-3xl text-white tracking-tight">{config.nombreNegocio}</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed pr-4">
              Nuestra vocación es salvar vidas y procurar el mayor bienestar para tu familia. Laboratorio, sala de procedimientos e internamiento.
            </p>
            <div className="flex items-center gap-2 text-red-400 bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-xs font-bold w-fit">
              <Activity size={14} />
              <span>Emergencias 24 Horas Activas</span>
            </div>
          </div>

          {/* 2. Secciones de la Página */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg tracking-wide">Secciones</h4>
            <ul className="space-y-3 text-sm font-medium text-slate-350">
              <li><a href="#inicio" className="hover:text-white hover:translate-x-1 inline-block transition-all">Inicio</a></li>
              <li><a href="#nosotros" className="hover:text-white hover:translate-x-1 inline-block transition-all">Nosotros</a></li>
              <li><a href="#servicios" className="hover:text-white hover:translate-x-1 inline-block transition-all">Servicios Médicos</a></li>
              <li><a href="#ubicacion" className="hover:text-white hover:translate-x-1 inline-block transition-all">Ubicación</a></li>
            </ul>
          </div>

          {/* 3. Conversa con nosotros */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg tracking-wide">Contacto</h4>
            <div className="space-y-3 text-sm font-medium text-slate-350">
              <p className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <Phone size={16} className="text-blue-500 shrink-0" />
                <span>{config.telefono}</span>
              </p>
              <p className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <span className="text-blue-500 font-bold text-base w-4 text-center shrink-0">+</span>
                <span>{config.telefonoEmergencia}</span>
              </p>
              <p className="flex items-center gap-3 hover:text-white transition-colors cursor-pointer">
                <Mail size={16} className="text-blue-500 shrink-0" />
                <span className="break-all">{config.correo}</span>
              </p>
            </div>
          </div>

          {/* 4. Síguenos (Redes Sociales) */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-lg tracking-wide">Síguenos</h4>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#" className="w-11 h-11 bg-[#111A36] border border-[#182854]/60 rounded-xl flex items-center justify-center overflow-hidden hover:border-blue-500 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                <img src={iconoFacebook} alt="Facebook" className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="w-11 h-11 bg-[#111A36] border border-[#182854]/60 rounded-xl flex items-center justify-center overflow-hidden hover:border-pink-500 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                <img src={iconoInstagram} alt="Instagram" className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="w-11 h-11 bg-[#111A36] border border-[#182854]/60 rounded-xl flex items-center justify-center overflow-hidden hover:border-slate-400 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                <img src={iconoTwitter} alt="Twitter" className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition-opacity" />
              </a>
              <a href="#" className="w-11 h-11 bg-[#111A36] border border-[#182854]/60 rounded-xl flex items-center justify-center overflow-hidden hover:border-red-500 transition-all duration-300 hover:-translate-y-1 shadow-lg">
                <img src={iconoYoutube} alt="Youtube" className="w-5 h-5 object-contain opacity-70 hover:opacity-100 transition-opacity" />
              </a>
            </div>
          </div>

        </div>
      </div>
      
      {/* Copyright Dinámico */}
      <div className="border-t border-[#182854]/30 py-6 text-center text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} Clínica Veterinaria {config.nombreNegocio}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default PiePaginaPortada;
