import { useState, useEffect } from 'react';
import { X, Save, PawPrint, AlertCircle, Sparkles, Calendar, Scale, ClipboardList } from 'lucide-react';
import { actualizarMascota } from '@/api/clienteApi';
import Combobox from '@/componentes/comun/Combobox';

const ModalEditarMascota = ({ mascota, onCerrar, onExito }) => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [otraEspecie, setOtraEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [pesoActual, setPesoActual] = useState('');
  const [alertasMedicas, setAlertasMedicas] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const LIMITE_CARACTERES = 350;

  const especiesOpciones = [
    { label: 'Perro' },
    { label: 'Gato' },
    { label: 'Conejo' },
    { label: 'Hamster' },
    { label: 'Loro' },
    { label: 'Otro' },
  ];

  useEffect(() => {
    if (mascota) {
      setNombre(mascota.nombre || '');
      setEspecie(mascota.especie || 'Perro');
      setRaza(mascota.raza || '');
      setFechaNacimiento(mascota.fechaNacimiento || '');
      setPesoActual(mascota.pesoActual?.toString() || '');
      setAlertasMedicas(mascota.alertasMedicas || '');
    }
  }, [mascota]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!nombre.trim() || !raza.trim() || !fechaNacimiento || !pesoActual) {
      setError('Por favor completa todos los campos requeridos.');
      return;
    }

    const especieFinal = especie === 'Otro' ? otraEspecie : especie;
    if (!especieFinal.trim()) {
      setError('Por favor especifica la especie de tu mascota.');
      return;
    }

    setCargando(true);
    try {
      const datos = {
        nombre: nombre.trim(),
        especie: especieFinal.trim(),
        raza: raza.trim(),
        fechaNacimiento,
        pesoActual: parseFloat(pesoActual),
        alertasMedicas: alertasMedicas.trim(),
        dueño: { id: mascota.dueño?.id ?? mascota.dueno?.id },
      };
      const actualizada = await actualizarMascota(mascota.id, datos);
      onExito(actualizada);
    } catch (err) {
      setError(err.response?.data || 'Error al actualizar la mascota. Reintenta.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/60 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center">
              <PawPrint size={18} className="text-sky-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Editar mascota</h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">{mascota?.nombre}</p>
            </div>
          </div>
          <button
            onClick={onCerrar}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 transition-colors"
            disabled={cargando}
          >
            <X size={16} />
          </button>
        </div>

        {/* Cuerpo */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-900/30 p-3.5 rounded-xl text-xs font-semibold">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Identidad */}
            <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 space-y-3 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles size={13} className="text-sky-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Identidad</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                  disabled={cargando}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Fecha de Nacimiento *</label>
                <input
                  type="date"
                  value={fechaNacimiento}
                  onChange={(e) => setFechaNacimiento(e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                  disabled={cargando}
                  required
                />
              </div>
            </div>

            {/* Clasificación */}
            <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 space-y-3 border border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <Calendar size={13} className="text-sky-500" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Clasificación</span>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Especie *</label>
                <Combobox
                  value={especie}
                  onChange={(val) => { setEspecie(val); if (val !== 'Otro') setOtraEspecie(''); }}
                  opciones={especiesOpciones}
                  placeholder="Selecciona..."
                  icono={PawPrint}
                />
              </div>
              {especie === 'Otro' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Especificar *</label>
                  <input
                    type="text"
                    value={otraEspecie}
                    onChange={(e) => setOtraEspecie(e.target.value)}
                    className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                    disabled={cargando}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Raza *</label>
                <input
                  type="text"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                  disabled={cargando}
                  required
                />
              </div>
            </div>
          </div>

          {/* Historial Clínico */}
          <div className="bg-slate-50 dark:bg-slate-950/60 rounded-xl p-4 space-y-3 border border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList size={13} className="text-sky-500" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Historial Clínico</span>
            </div>
            <div>
              <label className="flex items-center gap-1 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
                <Scale size={11} /> Peso actual (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={pesoActual}
                onChange={(e) => setPesoActual(e.target.value)}
                className="w-full sm:w-1/2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition-colors"
                disabled={cargando}
                required
              />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Alertas médicas / Observaciones</label>
                <span className={`text-[10px] font-bold ${alertasMedicas.length >= LIMITE_CARACTERES ? 'text-amber-500' : 'text-slate-400'}`}>
                  {alertasMedicas.length} / {LIMITE_CARACTERES}
                </span>
              </div>
              <textarea
                value={alertasMedicas}
                onChange={(e) => setAlertasMedicas(e.target.value)}
                maxLength={LIMITE_CARACTERES}
                rows={3}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 transition-colors resize-none"
                disabled={cargando}
              />
            </div>
          </div>

          {/* Acciones */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onCerrar}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              disabled={cargando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-sky-500/10 disabled:opacity-50"
              disabled={cargando}
            >
              {cargando ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={15} />
              )}
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditarMascota;
