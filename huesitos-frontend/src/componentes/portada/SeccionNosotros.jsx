import { motion } from 'framer-motion';
import { CheckCircle2, ShieldPlus } from 'lucide-react';

const SeccionNosotros = ({
  staggerContainer,
  imagenNosotros,
  config
}) => {
  return (
    <motion.section
      id="nosotros"
      className="py-16 sm:py-24 lg:py-32 bg-white dark:bg-[#0B1A30] relative transition-colors duration-300"
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-20 items-center">
          
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-100 to-sky-100 dark:from-[#152E54] dark:to-[#1D3E70]/30 rounded-[3rem] transform -rotate-3 group-hover:rotate-0 transition-all duration-500 -z-10"></div>
            <img
              src={imagenNosotros}
              alt="Equipo médico de la clínica"
              className="rounded-3xl shadow-2xl object-cover w-full h-64 sm:h-80 md:h-[450px] lg:h-[550px] transform group-hover:scale-[1.01] transition-all duration-500 grayscale-[15%] group-hover:grayscale-0"
            />
            <div className="absolute -bottom-8 -right-8 bg-blue-900 dark:bg-[#152E54] dark:border dark:border-[#1D3E70]/40 text-white p-8 rounded-3xl shadow-xl hidden md:block transition-colors">
              <p className="text-5xl font-black">10+</p>
              <p className="text-blue-200 dark:text-sky-300 font-medium mt-1">Años de Trayectoria</p>
            </div>
          </div>

          <div className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-blue-600 dark:text-sky-400 tracking-widest uppercase">
                Sobre Nosotros
              </h2>
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight transition-colors">
                Comprometidos con la salud y el bienestar animal.
              </h3>
            </div>

            <div className="space-y-6 text-lg text-slate-655 dark:text-slate-300 leading-relaxed transition-colors">
              <p>
                En <strong>Clínica Veterinaria {config.nombreNegocio}</strong> nos dedicamos a elevar el estándar de la atención médica veterinaria. Combinamos un trato profundamente humano y empático con rigurosos protocolos médicos y quirúrgicos.
              </p>
              <p>
                Contamos con infraestructura diseñada para mitigar el estrés de los pacientes, salas de procedimientos equipadas con tecnología avanzada y sistemas estrictos de control de bioseguridad.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6 pt-6">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-sky-100 dark:bg-[#152E54] text-sky-600 dark:text-sky-400 rounded-xl flex items-center justify-center transition-colors">
                  <CheckCircle2 size={22} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xl transition-colors">
                  Nuestra Misión
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">
                  Ofrecer diagnósticos certeros y soluciones médicas oportunas que faciliten la recuperación de cada mascota en un entorno seguro.
                </p>
              </div>
              <div className="space-y-3">
                <div className="w-12 h-12 bg-blue-100 dark:bg-[#152E54] text-blue-600 dark:text-sky-400 rounded-xl flex items-center justify-center transition-colors">
                  <ShieldPlus size={22} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xl transition-colors">
                  Nuestra Visión
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm transition-colors">
                  Consolidarnos como el centro hospitalario de referencia veterinaria, destacados por nuestra excelencia tecnológica y especialidades complejas.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </motion.section>
  );
};

export default SeccionNosotros;
