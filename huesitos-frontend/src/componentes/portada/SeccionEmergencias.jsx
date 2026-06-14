import { motion } from 'framer-motion';
import { ShieldPlus } from 'lucide-react';

const SeccionEmergencias = ({
  fadeUp,
  config
}) => {
  return (
    <motion.section
      id="emergencias"
      className="py-24 bg-sky-100 dark:bg-[#111A36] border-t border-sky-200 dark:border-[#182854]/40 transition-colors duration-300"
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
        <div className="inline-block p-4 bg-sky-200 dark:bg-[#16224F] rounded-2xl border border-sky-300 dark:border-[#1E2F6C]/40 transition-colors">
          <ShieldPlus size={40} className="text-sky-700 dark:text-sky-400 transition-colors" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white transition-colors">
          ¿Tienes una Emergencia?
        </h2>
        <p className="text-lg text-slate-700 dark:text-slate-350 transition-colors">
          Si tu mascota presenta signos críticos, no esperes. Contamos con atención de emergencia las 24 horas del día. 
          Comunícate inmediatamente para recibir asistencia prioritaria.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <a
            href={`tel:${config.telefonoEmergencia}`}
            className="bg-sky-750 hover:bg-sky-850 dark:bg-sky-600 dark:hover:bg-sky-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-sky-500/10 hover:shadow-sky-550/20 dark:shadow-sky-950/30 transition-all hover:-translate-y-0.5"
          >
            Llamar a Emergencias: {config.telefonoEmergencia}
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default SeccionEmergencias;
