import { useState, useEffect } from 'react';
import { useTema } from '@/contextos/ContextoTema';
import { obtenerConfiguracionNegocio } from '@/api/configuracionApi';

// === COMPONENTES MODULARES ===
import EncabezadoPortada from '@/componentes/portada/EncabezadoPortada';
import SeccionHero from '@/componentes/portada/SeccionHero';
import SeccionNosotros from '@/componentes/portada/SeccionNosotros';
import SeccionServicios from '@/componentes/portada/SeccionServicios';
import SeccionUbicacion from '@/componentes/portada/SeccionUbicacion';
import SeccionEmergencias from '@/componentes/portada/SeccionEmergencias';
import PiePaginaPortada from '@/componentes/portada/PiePaginaPortada';

// === ASSETS LOCALES ===
import imagenNosotros from '@/assets/veterinario.jpg';
import portada from '@/assets/portada.jpg';
import iconoFacebook from '@/assets/facebook.png';
import iconoInstagram from '@/assets/social.png';
import iconoTwitter from '@/assets/gorjeo.png';
import iconoYoutube from '@/assets/youtube.png';
import logo from '@/assets/Logo Huesitos.png';

const Portada = () => {
  const { tema, alternarTema } = useTema();
  const [menuAbierto, setMenuAbierto] = useState(false);

  // Animaciones Framer Motion
  const fadeUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } }
  };

  // === ESTADO DINÁMICO DE CONFIGURACIÓN ===
  const [config, setConfig] = useState({
    nombreNegocio: "Huesitos",
    telefono: "(01) 628-2000",
    telefonoEmergencia: "+51 994 142 421",
    correo: "VeterinariaHuesito@gmail.com",
    direccion: "Santo Domingo De Marcona C-22, Ica, Ica, 11001",
    horarioSemana: "Lunes a Sábado: 08:00 AM - 08:00 PM",
    horarioDomingo: "Domingos: 09:00 AM - 02:00 PM"
  });

  // === EFECTO PARA TRAER DATOS REALES DEL BACKEND ===
  useEffect(() => {
    obtenerConfiguracionNegocio()
      .then((data) => {
        if (data) setConfig(data);
      })
      .catch((err) => console.warn("Usando datos estáticos de respaldo:", err));
  }, []);


  return (
    <div className="min-h-screen bg-slate-50 dark:bg-oscuro-base text-slate-800 dark:text-slate-100 font-sans scroll-smooth selection:bg-blue-600 selection:text-white transition-colors duration-300">
      
      {/* 1. NAVEGACIÓN */}
      <EncabezadoPortada
        config={config}
        tema={tema}
        alternarTema={alternarTema}
        menuAbierto={menuAbierto}
        setMenuAbierto={setMenuAbierto}
        logo={logo}
      />

      {/* 2. HERO / INICIO */}
      <SeccionHero
        fadeUp={fadeUp}
        portada={portada}
        config={config}
      />

      {/* 3. NOSOTROS */}
      <SeccionNosotros
        staggerContainer={staggerContainer}
        imagenNosotros={imagenNosotros}
        config={config}
      />

      {/* 4. SERVICIOS Y TARIFAS */}
      <SeccionServicios
        fadeUp={fadeUp}
        config={config}
      />

      {/* 5. UBICACIÓN Y HORARIOS */}
      <SeccionUbicacion
        staggerContainer={staggerContainer}
        config={config}
      />

      {/* 6. emergencias */}
      <SeccionEmergencias
        fadeUp={fadeUp}
        config={config}
      />

      {/* 7. FOOTER */}
      <PiePaginaPortada
        config={config}
        iconoFacebook={iconoFacebook}
        iconoInstagram={iconoInstagram}
        iconoTwitter={iconoTwitter}
        iconoYoutube={iconoYoutube}
      />

    </div>
  );
};

export default Portada;