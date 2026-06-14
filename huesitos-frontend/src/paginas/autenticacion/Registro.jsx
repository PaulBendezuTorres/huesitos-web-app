import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import ContenedorAutenticacion from '@/componentes/autenticacion/ContenedorAutenticacion';
import CampoFormulario from '@/componentes/autenticacion/CampoFormulario';
import BotonVolver from '@/componentes/comun/BotonVolver';

const Registro = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!nombre || !apellido || !email || !password || !confirmPassword) {
      setErrorMsg('Todos los campos son obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden');
      return;
    }

    if (!aceptaTerminos) {
      setErrorMsg('Debes aceptar los términos y condiciones');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/autenticacion/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCompleto: `${nombre} ${apellido}`,
          telefono: null,
          direccion: null,
          usuario: {
            nombre: nombre,
            apellido: apellido,
            correo: email,
            contrasena: password
          }
        }),
      });

      if (response.ok) {
        setSuccessMsg('Cuenta creada correctamente. Redirigiendo a la verificación de cuenta...');
        setTimeout(() => {
          navigate(`/verificar-cuenta?correo=${encodeURIComponent(email)}`);
        }, 2000);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Error al registrar la cuenta');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión con el servidor.');
    }
  };

  return (
    <ContenedorAutenticacion
      badgeIcon="🐶"
      badgeText="Únete a la familia Huesitos"
      titleMain="La salud de tu mascota en"
      titleHighlight="buenas manos"
      description="Crea una cuenta para agendar citas médicas, acceder al historial clínico y comprar en nuestra tienda online."
      chips={[
        { icon: '📅', label: 'Citas online' },
        { icon: '🛒', label: 'Tienda pet' },
        { icon: '📁', label: 'Historial digital' },
      ]}
    >
      {/* CABECERA: título + botón volver */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
            Crea tu cuenta
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold transition-colors">
            Registra tus datos como dueño de mascota
          </p>
        </div>
        <BotonVolver />
      </div>

      {/* Mensajes de error/éxito */}
      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-405 border border-red-100 dark:border-red-900/30 rounded-xl p-3 text-xs font-semibold mb-4 transition-colors">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 dark:text-emerald-405 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-3 text-xs font-semibold mb-4 transition-colors">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CampoFormulario
            id="nombre"
            label="Nombre"
            type="text"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Juan"
            required
            icon={User}
          />
          <CampoFormulario
            id="apellido"
            label="Apellido"
            type="text"
            value={apellido}
            onChange={e => setApellido(e.target.value)}
            placeholder="Pérez"
            required
            icon={User}
          />
        </div>

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <CampoFormulario
            id="confirmPassword"
            label="Confirmar contraseña"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmarPassword(e.target.value)}
            placeholder="••••••••"
            required
            icon={Lock}
          />
        </div>

        <div className="flex items-start gap-2.5 py-1">
          <input
            type="checkbox"
            id="terminos"
            checked={aceptaTerminos}
            onChange={e => setAceptaTerminos(e.target.checked)}
            className="w-4 h-4 text-sky-500 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded focus:ring-sky-400 dark:focus:ring-sky-500 focus:ring-2 outline-none cursor-pointer mt-0.5"
          />
          <label 
            htmlFor="terminos" 
            className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold cursor-pointer select-none leading-relaxed transition-colors"
          >
            Acepto los términos y condiciones de privacidad de datos personales.
          </label>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
        >
          Crear cuenta
        </button>
      </form>
    </ContenedorAutenticacion>
  );
};

export default Registro;
