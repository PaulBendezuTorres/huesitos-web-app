import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, PawPrint, AlertCircle, Heart } from 'lucide-react';
import { registrarMascota } from '@/api/clienteApi';

const RegistrarMascotaCliente = () => {
  const navigate = useNavigate();
  const duenoId = localStorage.getItem('duenoId');

  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [otraEspecie, setOtraEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [pesoActual, setPesoActual] = useState('');
  const [alertasMedicas, setAlertasMedicas] = useState('');
  
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const especiesComunes = ['Perro', 'Gato', 'Conejo', 'Hamster', 'Loro', 'Otro'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    if (!nombre.trim() || !raza.trim() || !fechaNacimiento || !pesoActual) {
      setError('Por favor completa todos los campos requeridos.');
      setCargando(false);
      return;
    }

    if (!duenoId) {
      setError('No se pudo identificar tu cuenta de dueño. Inicia sesión nuevamente.');
      setCargando(false);
      return;
    }

    const especieFinal = especie === 'Otro' ? otraEspecie : especie;
    if (!especieFinal.trim()) {
      setError('Por favor especifica la especie de tu mascota.');
      setCargando(false);
      return;
    }

    const datosMascota = {
      nombre: nombre.trim(),
      especie: especieFinal.trim(),
      raza: raza.trim(),
      fechaNacimiento,
      pesoActual: parseFloat(pesoActual),
      alertasMedicas: alertasMedicas.trim(),
      dueño: {
        id: parseInt(duenoId)
      }
    };

    try {
      await registrarMascota(datosMascota);
      setExito(true);
      setTimeout(() => {
        navigate('/cliente/mascotas');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Ocurrió un error al registrar a la mascota. Por favor, reintenta.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Botón Volver */}
      <button
        onClick={() => navigate('/cliente/mascotas')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-semibold transition-colors duration-250"
      >
        <ArrowLeft size={16} /> Volver a mis mascotas
      </button>

      {/* Tarjeta Principal del Formulario */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-md transition-colors duration-300">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-5 mb-6">
          <div className="w-10 h-10 bg-sky-50 dark:bg-sky-950/40 rounded-xl flex items-center justify-center text-sky-500 dark:text-sky-400">
            <PawPrint size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Registrar Nueva Mascota</h2>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-0.5">Ingresa los datos clínicos y básicos de tu mascota</p>
          </div>
        </div>

        {/* Mensajes de feedback */}
        {error && (
          <div className="flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30 p-4 rounded-xl text-xs font-semibold mb-6">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {exito && (
          <div className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl text-xs font-semibold mb-6">
            <Heart size={16} className="shrink-0 animate-bounce text-emerald-500" />
            <span>¡Mascota registrada con éxito! Redireccionando...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Fila 1: Nombre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5">
              Nombre de la mascota *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. Bobby, Luna"
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors duration-200"
              required
              disabled={cargando || exito}
            />
          </div>

          {/* Fila 2: Especie y Raza */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5">
                Especie *
              </label>
              <select
                value={especie}
                onChange={(e) => {
                  setEspecie(e.target.value);
                  if (e.target.value !== 'Otro') setOtraEspecie('');
                }}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors duration-200"
                disabled={cargando || exito}
              >
                {especiesComunes.map((esp) => (
                  <option key={esp} value={esp}>
                    {esp}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5">
                Raza *
              </label>
              <input
                type="text"
                value={raza}
                onChange={(e) => setRaza(e.target.value)}
                placeholder="Ej. Golden Retriever, Criollo"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors duration-200"
                required
                disabled={cargando || exito}
              />
            </div>
          </div>

          {/* Campo condicional para otra especie */}
          {especie === 'Otro' && (
            <div className="animate-fadeIn">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5">
                Especifique la especie *
              </label>
              <input
                type="text"
                value={otraEspecie}
                onChange={(e) => setOtraEspecie(e.target.value)}
                placeholder="Ej. Hurón, Hámster Ruso"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors duration-200"
                required
                disabled={cargando || exito}
              />
            </div>
          )}

          {/* Fila 3: Fecha Nacimiento y Peso */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5">
                Fecha de Nacimiento *
              </label>
              <input
                type="date"
                value={fechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors duration-200"
                required
                disabled={cargando || exito}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5">
                Peso actual (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pesoActual}
                onChange={(e) => setPesoActual(e.target.value)}
                placeholder="Ej. 12.5"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors duration-200"
                required
                disabled={cargando || exito}
              />
            </div>
          </div>

          {/* Fila 4: Alertas Médicas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5">
              Alertas médicas / Observaciones (Opcional)
            </label>
            <textarea
              value={alertasMedicas}
              onChange={(e) => setAlertasMedicas(e.target.value)}
              placeholder="Ej. Alérgico a la penicilina, sufre del corazón"
              rows={3}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors duration-200 resize-none"
              disabled={cargando || exito}
            />
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-850 pt-5 mt-6">
            <button
              type="button"
              onClick={() => navigate('/cliente/mascotas')}
              className="px-5 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors duration-200"
              disabled={cargando || exito}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-sm font-bold transition-all duration-300 shadow-md shadow-sky-500/10 disabled:opacity-50"
              disabled={cargando || exito}
            >
              {cargando ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={16} />
              )}
              Registrar mascota
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrarMascotaCliente;
