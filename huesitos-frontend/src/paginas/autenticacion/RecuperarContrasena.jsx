import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail } from 'lucide-react';
import ContenedorAutenticacion from '@/componentes/autenticacion/ContenedorAutenticacion';
import CampoFormulario from '@/componentes/autenticacion/CampoFormulario';
import BotonVolver from '@/componentes/comun/BotonVolver';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email) {
      setErrorMsg('Por favor, ingresa tu correo electrónico');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/autenticacion/olvide-contrasena?correo=${encodeURIComponent(email)}`, {
        method: 'POST',
      });

      if (response.ok) {
        setSuccessMsg('¡Código enviado! Revisa tu bandeja de entrada (o spam) para obtener tu código de 6 dígitos.');
        setTimeout(() => {
          navigate('/restablecer-contrasena');
        }, 1500);
      } else {
        const errorText = await response.text();
        setErrorMsg(errorText || 'Error al procesar la solicitud');
      }
    } catch (error) {
      console.error('Error de red:', error);
      setErrorMsg('Error de conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContenedorAutenticacion
      badgeIcon="🔑"
      badgeText="Recuperación de contraseña"
      titleMain="¿Olvidaste tu"
      titleHighlight="contraseña?"
      description="No te preocupes. Ingresa tu correo electrónico registrado y te enviaremos un código de seguridad para restablecer tu acceso."
      chips={[
        { icon: '📧', label: 'Código de 6 dígitos' },
        { icon: '⏱️', label: 'Expira en 15m' },
        { icon: '🛡️', label: 'Acceso protegido' },
      ]}
    >
      {/* CABECERA: botón volver + título */}
      <div className="flex flex-wrap items-start justify-between gap-2 mb-5">
        <div className="min-w-0">
          <h2 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
            Recuperar contraseña
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 font-semibold transition-colors">
            Solicita tu código de verificación de 6 dígitos
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

      <form onSubmit={handleSubmit} className="space-y-5">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? 'Enviando...' : 'Enviar código de verificación'}
        </button>
      </form>
    </ContenedorAutenticacion>
  );
};

export default RecuperarContrasena;
