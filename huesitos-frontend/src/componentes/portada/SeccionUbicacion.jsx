import { motion } from 'framer-motion';
import { MapPin, Clock } from 'lucide-react';

const SeccionUbicacion = ({
  staggerContainer,
  config
}) => {
  return (
    <motion.section
      id="ubicacion"
      className="py-24 bg-white dark:bg-[#0B1A30] border-t border-slate-200 dark:border-[#1D3E70]/40 transition-colors duration-300"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8">
            <div>
              <h2 className="text-sm font-bold text-blue-600 dark:text-sky-400 tracking-widest uppercase mb-2">
                Visítanos
              </h2>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white transition-colors">
                Nuestra Ubicación
              </h3>
            </div>
            <p className="text-lg text-slate-655 dark:text-slate-300 transition-colors">
              Estamos estratégicamente ubicados para atender cualquier emergencia con rapidez y brindar el mejor cuidado médico a tu engreído en instalaciones de primer nivel.
            </p>
            
            <div className="space-y-6 bg-slate-50 dark:bg-[#152E54] p-8 rounded-3xl border border-slate-100 dark:border-[#1D3E70]/30 transition-colors duration-200">
              <div className="flex items-start gap-4">
                <MapPin className="text-blue-600 dark:text-sky-400 mt-1 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg transition-colors">
                    Dirección Principal
                  </h4>
                  <p className="text-slate-600 dark:text-slate-350 mt-1 transition-colors">{config.direccion}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Clock className="text-blue-600 dark:text-sky-400 mt-1 shrink-0" size={24} />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-lg transition-colors">
                    Horarios de Atención
                  </h4>
                  <p className="text-slate-600 dark:text-slate-350 mt-1 transition-colors">
                    {config.horarioSemana} <br/>
                    {config.horarioDomingo}
                  </p>
                  <span className="inline-block mt-2 text-xs font-bold bg-red-100 dark:bg-red-950/40 text-red-650 dark:text-red-400 px-3 py-1 rounded-full border border-red-200 dark:border-red-900/60 transition-colors">
                    Emergencias 24/7
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mapa de Google Maps Integrado */}
          <div className="w-full h-[450px] rounded-3xl shadow-lg overflow-hidden relative border border-slate-200 dark:border-[#1D3E70]/40">
            <iframe 
              title="Ubicación Clínica Veterinaria"
              src="https://maps.google.com/maps?q=Santo%20Domingo%20De%20Marcona%20C-22,%20Ica,%20Peru&t=&z=16&ie=UTF8&iwloc=&output=embed" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale-[10%] dark:grayscale-[30%] dark:invert-[90%] dark:hue-rotate-[180deg] transition-all"
            ></iframe>
          </div>

        </div>
      </div>
    </motion.section>
  );
};

export default SeccionUbicacion;
