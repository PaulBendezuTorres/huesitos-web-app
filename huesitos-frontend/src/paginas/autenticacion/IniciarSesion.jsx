import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import ContenedorAutenticacion from '@/componentes/autenticacion/ContenedorAutenticacion';
import CampoFormulario from '@/componentes/autenticacion/CampoFormulario';
import BotonVolver from '@/componentes/comun/BotonVolver';
import { useTema } from '@/contextos/ContextoTema';

const IniciarSesion = () => {
  const { cambiarTema } = useTema();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await fetch('http://localhost:8080/api/autenticacion/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          correo: email, 
          contrasena: password 
        }),
      });

      if (response.ok) {
        const data = await response.json(); 
        
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuarioCorreo', data.correo);
        localStorage.setItem('usuarioRol', data.rol);
        if (data.usuarioId) localStorage.setItem('usuarioId', data.usuarioId);
        if (data.duenoId) localStorage.setItem('duenoId', data.duenoId);
        if (data.fotoPerfilUrl) localStorage.setItem('fotoPerfilUrl', data.fotoPerfilUrl);
        if (data.tema) {
          localStorage.setItem('tema', data.tema);
          cambiarTema(data.tema);
        }

        // Redirección dinámica según el rol
        if (data.rol === 'ADMINISTRADOR') {
          navigate('/admin');
        } else if (data.rol === 'CLIENTE') {
          navigate('/cliente');
        } else if (data.rol === 'VETERINARIO') {
          navigate('/veterinario');
        } else if (data.rol === 'RECEPCIONISTA') {
          navigate('/recepcion');
        } else {
          navigate('/');
        }
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión con el servidor.');
    }
  };

  return (
    <ContenedorAutenticacion
      badgeIcon="🛡️"
      badgeText="Medicina veterinaria de vanguardia"
      titleMain="Excelencia médica para"
      titleHighlight="quienes más amas"
      description="Las consultas médicas nos ayudan a monitorear la salud de tu mascota con tecnología de vanguardia y especialistas certificados."
      chips={[
        { icon: '🔬', label: 'Laboratorio 24h' },
        { icon: '🩺', label: 'Especialistas' },
        { icon: '📞', label: 'Emergencias 24/7' },
      ]}
    >
      {/* CABECERA: título + botón volver */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
            Iniciar sesión
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold transition-colors">
            Bienvenido de nuevo a Huesitos
          </p>
        </div>
        <BotonVolver />
      </div>

      {/* Mensaje de error si falla el login */}
      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-405 border border-red-100 dark:border-red-900/30 rounded-xl p-3 text-xs font-semibold mb-4 transition-colors">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <CampoFormulario
          id="email"
          label="Correo electrónico"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="correo@ejemplo.com"
          required
          icon={Mail}
        />

        <CampoFormulario
          id="password"
          label="Contraseña"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          icon={Lock}
        />

        <div className="text-right">
          <button
            type="button"
            onClick={() => navigate('/olvide-contrasena')}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
        >
          Ingresar
        </button>
      </form>

      <div className="relative flex items-center justify-center my-6">
        <hr className="w-full border-slate-100 dark:border-slate-800 transition-colors" />
      </div>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 font-semibold transition-colors">
        ¿Nuevo aquí?{' '}
        <button
          onClick={() => navigate('/registro')}
          className="font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 transition-colors"
        >
          Crea una cuenta
        </button>
      </p>
    </ContenedorAutenticacion>
  );
};

export default IniciarSesion;