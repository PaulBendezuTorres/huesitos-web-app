import { useState, useEffect } from "react";
import { Settings, Save, AlertCircle, CheckCircle } from 'lucide-react';
import CargadorSpinner from '@/componentes/comun/CargadorSpinner';
import { obtenerConfiguracionNegocio, actualizarConfiguracionNegocio } from '@/api/configuracionApi';
import FormularioInfoNegocio from '@/componentes/dashboard/FormularioInfoNegocio';
import FormularioContacto from '@/componentes/dashboard/FormularioContacto';
import FormularioFinanciero from '@/componentes/dashboard/FormularioFinanciero';

const EsqueletoFormulario = () => (
  <div className="space-y-6 animate-pulse">
    {/* Esqueleto Bloque 1 - Información del Negocio */}
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 space-y-5">
      <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-750 rounded"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-700/40 rounded-xl"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-750 rounded"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-700/40 rounded-xl"></div>
        </div>
        <div className="sm:col-span-2 space-y-2">
          <div className="h-4 w-32 bg-slate-200 dark:bg-slate-750 rounded"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-700/40 rounded-xl"></div>
        </div>
      </div>
    </div>
    
    {/* Esqueleto Bloque 2 - Operaciones y Contacto */}
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 space-y-5">
      <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-750 rounded"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-700/40 rounded-xl"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-750 rounded"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-700/40 rounded-xl"></div>
        </div>
      </div>
    </div>

    {/* Esqueleto Bloque 3 - Parámetros Financieros */}
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-6 space-y-5">
      <div className="h-6 w-48 bg-slate-200 dark:bg-slate-700 rounded-lg"></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-750 rounded"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-700/40 rounded-xl"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-200 dark:bg-slate-750 rounded"></div>
          <div className="h-10 bg-slate-100 dark:bg-slate-700/40 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
);

const ConfiguracionDinamica = () => {
  const [form, setForm] = useState({
    nombreNegocio: "",
    telefono: "",
    telefonoEmergencia: "",
    correo: "",
    direccion: "",
    horarioSemana: "",
    horarioDomingo: "",
    moneda: "Soles",
    impuesto: 0
  });
  const [loading, setLoading] = useState(true);
  const [cargarFallido, setCargarFallido] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const cargarConfiguracion = () => {
    setLoading(true);
    setCargarFallido(false);
    setErrorMsg('');
    obtenerConfiguracionNegocio()
      .then((data) => {
        if (data) setForm(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener la configuración:", err);
        setErrorMsg("Error al obtener la configuración global.");
        setCargarFallido(true);
        setLoading(false);
      });
  };

  useEffect(() => {
    cargarConfiguracion();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "impuesto" ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const data = await actualizarConfiguracionNegocio(form);
      if (data) setForm(data);
      setSuccessMsg("Configuración global actualizada con éxito.");
      alert("Configuración global actualizada con éxito.");
    } catch (error) {
      console.error("Error al actualizar:", error);
      setErrorMsg("Error al intentar actualizar los parámetros.");
      alert("Error al intentar actualizar los parámetros.");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* CABECERA */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm">
        <div className="p-2.5 bg-sky-50 dark:bg-sky-950/50 text-sky-500 rounded-xl">
          <Settings size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Configuración Global</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Parámetros operativos y financieros de la clínica.</p>
        </div>
      </div>

      {errorMsg && (
        <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/50 rounded-2xl p-4 text-sm font-semibold flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-4 text-sm font-semibold flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
          <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-500 mt-0.5" />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <EsqueletoFormulario />
      ) : cargarFallido ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm gap-4 text-center">
          <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-full">
            <AlertCircle size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">No se pudo cargar la configuración</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-sm mx-auto">
              Ocurrió un error de autenticación (403) o red al conectar con el servidor. Verifica tu sesión e inténtalo de nuevo.
            </p>
          </div>
          <button
            onClick={cargarConfiguracion}
            className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-bold rounded-xl shadow-md transition-all active:scale-95"
          >
            Reintentar Carga
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección de Identidad */}
          <FormularioInfoNegocio form={form} onChange={handleChange} />

          {/* Sección de Operaciones */}
          <FormularioContacto form={form} onChange={handleChange} />

          {/* Sección Financiera */}
          <FormularioFinanciero form={form} onChange={handleChange} />

          {/* Botones de acción */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={guardando}
              className="px-8 py-3 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white text-sm font-black rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 focus:ring-2 focus:ring-offset-2 outline-none disabled:opacity-50"
            >
              {guardando ? (
                <>
                  <CargadorSpinner size="xs" color="border-white" />
                  <span>Sincronizando...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span>Guardar Cambios</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ConfiguracionDinamica;