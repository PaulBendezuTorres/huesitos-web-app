import { useState, useRef } from 'react';
import { Save, PawPrint, AlertCircle, Heart, Upload, Image as ImageIcon, Sparkles, Calendar, Scale, ClipboardList } from 'lucide-react';
import { registrarMascota, subirFotoMascota } from '@/api/clienteApi';
import Combobox from '@/componentes/comun/Combobox';

const FormularioRegistroMascota = ({ duenoId, onExito, onCancelar }) => {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('Perro');
  const [otraEspecie, setOtraEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [fechaNacimiento, setFechaNacimiento] = useState('');
  const [pesoActual, setPesoActual] = useState('');
  const [alertasMedicas, setAlertasMedicas] = useState('');
  
  // Estados para la foto
  const [archivoFoto, setArchivoFoto] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState('');
  const archivoInputRef = useRef(null);

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  const LIMITE_PESO_FOTO = 2 * 1024 * 1024; // 2 MB
  const LIMITE_CARACTERES_ALERTAS = 350;

  const especiesOpciones = [
    { label: 'Perro' },
    { label: 'Gato' },
    { label: 'Conejo' },
    { label: 'Hamster' },
    { label: 'Loro' },
    { label: 'Otro' }
  ];

  const manejarCambioFoto = (e) => {
    setError('');
    const archivo = e.target.files[0];
    if (!archivo) return;

    if (archivo.size > LIMITE_PESO_FOTO) {
      setError('La foto supera el tamaño máximo permitido de 2 MB.');
      setArchivoFoto(null);
      setVistaPrevia('');
      if (archivoInputRef.current) archivoInputRef.current.value = '';
      return;
    }

    setArchivoFoto(archivo);
    const lector = new FileReader();
    lector.onloadend = () => {
      setVistaPrevia(lector.result);
    };
    lector.readAsDataURL(archivo);
  };

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
      // 1. Crear mascota
      const mascotaRegistrada = await registrarMascota(datosMascota);

      // 2. Subir foto si está seleccionada
      if (archivoFoto && mascotaRegistrada.id) {
        await subirFotoMascota(mascotaRegistrada.id, archivoFoto);
      }

      setExito(true);
      if (onExito) {
        setTimeout(() => {
          onExito(mascotaRegistrada);
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data || 'Ocurrió un error al registrar a la mascota. Por favor, reintenta.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensajes de feedback */}
      {error && (
        <div className="flex items-start gap-2.5 bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-450 border border-rose-100 dark:border-rose-900/30 p-4 rounded-xl text-xs font-semibold">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {exito && (
        <div className="flex items-start gap-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 border border-emerald-100 dark:border-emerald-900/30 p-4 rounded-xl text-xs font-semibold">
          <Heart size={16} className="shrink-0 animate-bounce text-emerald-500" />
          <span>¡Mascota registrada con éxito! Redireccionando...</span>
        </div>
      )}

      {/* DISEÑO EN 4 CUADRADOS INDEPENDIENTES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CUADRADO 1: DATOS GENERALES DE IDENTIDAD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Sparkles size={16} className="text-sky-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                1. Identidad
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
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

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
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
            </div>
          </div>
        </div>

        {/* CUADRADO 2: ESPECIE Y CLASIFICACIÓN */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 dark:border-slate-850 pb-3">
              <Calendar size={16} className="text-sky-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                2. Clasificación
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5">
                  Especie *
                </label>
                <Combobox
                  value={especie}
                  onChange={(val) => {
                    setEspecie(val);
                    if (val !== 'Otro') setOtraEspecie('');
                  }}
                  opciones={especiesOpciones}
                  placeholder="Selecciona o escribe..."
                  icono={PawPrint}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5">
                  Raza *
                </label>
                <input
                  type="text"
                  value={raza}
                  onChange={(e) => setRaza(e.target.value)}
                  placeholder="Ej. Golden Retriever, Siames"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors duration-200"
                  required
                  disabled={cargando || exito}
                />
              </div>

              {especie === 'Otro' && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5">
                    Especificar especie alternativa *
                  </label>
                  <input
                    type="text"
                    value={otraEspecie}
                    onChange={(e) => setOtraEspecie(e.target.value)}
                    placeholder="Ej. Erizo de Tierra, Hurón"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors duration-200"
                    required
                    disabled={cargando || exito}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CUADRADO 3: FOTOGRAFÍA DE LA MASCOTA */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 dark:border-slate-850 pb-3">
              <ImageIcon size={16} className="text-sky-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                3. Fotografía
              </h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div 
                onClick={() => !cargando && !exito && archivoInputRef.current?.click()}
                className="w-28 h-28 rounded-2xl border-2 border-dashed border-slate-250 dark:border-slate-800 hover:border-sky-500 dark:hover:border-sky-500 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-center relative cursor-pointer group overflow-hidden transition-all duration-250 shrink-0"
              >
                {vistaPrevia ? (
                  <>
                    <img
                      src={vistaPrevia}
                      alt="Vista previa"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/45 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Upload size={18} className="text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-slate-400 dark:text-slate-650 flex flex-col items-center gap-1">
                    <PawPrint size={24} className="text-slate-350 dark:text-slate-700" />
                    <span className="text-[9px] font-black uppercase tracking-wider">Elegir</span>
                  </div>
                )}
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Sube su retrato</h4>
                <p className="text-[10px] text-slate-450 dark:text-slate-550 leading-relaxed">
                  Formatos permitidos: JPG, PNG, WebP. Peso máximo: **2 MB**.
                </p>
                <input
                  type="file"
                  ref={archivoInputRef}
                  onChange={manejarCambioFoto}
                  accept="image/*"
                  className="hidden"
                  disabled={cargando || exito}
                />
                <button
                  type="button"
                  onClick={() => archivoInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700"
                  disabled={cargando || exito}
                >
                  <Upload size={10} /> Subir archivo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CUADRADO 4: INFORMACIÓN MÉDICA Y ALERTAS CON LÍMITE DE 350 CARACTERES */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-md transition-colors duration-300 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 mb-5 border-b border-slate-100 dark:border-slate-850 pb-3">
              <ClipboardList size={16} className="text-sky-500" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                4. Historial Clínico
              </h3>
            </div>

            <div className="space-y-4">
              {/* Peso actual */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-550 dark:text-slate-400 mb-1.5 flex items-center gap-1">
                  <Scale size={12} className="text-slate-400" /> Peso actual (kg) *
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

              {/* Alertas médicas con límite de 350 */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Alertas médicas / Observaciones
                  </label>
                  <span className={`text-[10px] font-bold ${
                    alertasMedicas.length >= LIMITE_CARACTERES_ALERTAS ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {alertasMedicas.length} / {LIMITE_CARACTERES_ALERTAS}
                  </span>
                </div>
                <textarea
                  value={alertasMedicas}
                  onChange={(e) => setAlertasMedicas(e.target.value)}
                  maxLength={LIMITE_CARACTERES_ALERTAS}
                  placeholder="Ej. Alérgico a penicilinas, sensible al frío. (Máximo 350 caracteres)"
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:border-sky-500 dark:focus:border-sky-500 transition-colors duration-200 resize-none"
                  disabled={cargando || exito}
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
        <button
          type="button"
          onClick={onCancelar}
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
  );
};

export default FormularioRegistroMascota;
