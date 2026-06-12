import { useState } from "react";
import { PlusCircle, Stethoscope, Tag, Clock, FileText, Camera } from 'lucide-react';
import Combobox from "./Combobox";
import CargadorSpinner from "./CargadorSpinner";
import AreaTexto from "./AreaTexto";

// Catálogo predefinido
const CATALOGO_PREDEFINIDO = [
  {
    categoria: "Consultas Médicas",
    servicios: [
      { nombre: "Consulta general", precio: 80.00 },
      { nombre: "Consulta general - Medicina felina", precio: 100.00 },
      { nombre: "Consulta de urgencia", precio: 120.00 },
      { nombre: "Consulta a domicilio", precio: 150.00 },
      { nombre: "Consulta de emergencia", precio: 160.00 },
    ]
  },
  {
    categoria: "Especialidades",
    servicios: [
      { nombre: "Consulta de Cardiología", precio: 250.00 },
      { nombre: "Consulta de Dermatología", precio: 250.00 },
      { nombre: "Consulta de Cirugía", precio: 250.00 },
      { nombre: "Consulta de Oncología", precio: 250.00 },
      { nombre: "Consulta de Endocrinología", precio: 250.00 },
      { nombre: "Consulta de Neurología", precio: 250.00 },
      { nombre: "Consulta de Nutrición", precio: 335.00 },
      { nombre: "Consulta de Medicina Física / Fisioterapia", precio: 175.00 },
      { nombre: "Consulta de Traumatología y Ortopedia", precio: 275.00 },
      { nombre: "Consulta de Oftalmología", precio: 300.00 },
    ]
  },
  {
    categoria: "Vacunas",
    servicios: [
      { nombre: "Vacuna Antirrábica", precio: 50.00 },
      { nombre: "Vacuna Quíntuple", precio: 100.00 },
      { nombre: "Vacuna Triple Felina", precio: 90.00 },
      { nombre: "Vacuna Leptospirosis", precio: 45.00 },
      { nombre: "Vacuna Puppy DP", precio: 60.00 },
      { nombre: "Vacuna Cuádruple", precio: 70.00 },
      { nombre: "Vacuna Leucemia Felina", precio: 90.00 },
    ]
  },
  {
    categoria: "Laboratorio e Imágenes",
    servicios: [
      { nombre: "Chequeo Preventivo Integral*", precio: 425.00 },
      { nombre: "Hemograma Completo", precio: 65.00 },
      { nombre: "Coprológico Completo", precio: 90.00 },
      { nombre: "Examen Completo de Orina", precio: 40.00 },
      { nombre: "Perfil Bioquímico Pre-Anestésico", precio: 320.00 },
      { nombre: "Perfil Bioquímico Diagnóstico", precio: 200.00 },
      { nombre: "Perfil Bioquímico Integral", precio: 270.00 },
    ]
  },
  {
    categoria: "Internamiento",
    servicios: [
      { nombre: "Internamiento de Día (incluye fluidoterapia)", precio: 120.00 },
      { nombre: "Internamiento Día Completo (incluye fluidoterapia)", precio: 200.00 },
      { nombre: "Internamiento de Día (incluye fluidoterapia) - Paciente infeccioso*", precio: 170.00 },
      { nombre: "Internamiento Día Completo (incluye fluidoterapia) - Paciente infeccioso*", precio: 250.00 },
    ]
  }
];


const FormularioServicio = ({ onGuardar }) => {
  const estadoInicial = { nombre: "", descripcion: "", duracionMinutos: "", precio: "" };
  const [form, setForm] = useState(estadoInicial);
  const [archivo, setArchivo] = useState(null);
  const [vistaPrevia, setVistaPrevia] = useState(null);
  const [procesando, setProcesando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let nuevoPrecio = form.precio;
    if (name === "nombre") {
      for (const cat of CATALOGO_PREDEFINIDO) {
        const servicio = cat.servicios.find(s => s.nombre.toLowerCase() === value.toLowerCase());
        if (servicio) {
          nuevoPrecio = servicio.precio;
          break;
        }
      }
    }
    setForm({ ...form, [name]: value, precio: nuevoPrecio });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("El tamaño de la imagen no debe superar los 5MB");
      e.target.value = "";
      return;
    }

    setArchivo(file);
    setVistaPrevia(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcesando(true);
    try {
      await onGuardar({ ...form, duracionMinutos: parseInt(form.duracionMinutos), precio: parseFloat(form.precio) }, archivo);
      setForm(estadoInicial);
      setArchivo(null);
      setVistaPrevia(null);
    } catch (err) {
      console.error(err);
    } finally {
      setProcesando(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-5">
      <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest border-b pb-3 mb-2 flex items-center gap-2">
        <Stethoscope className="text-sky-500" size={18} /> Registrar Nuevo Servicio
      </h2>
      
      {/* Carga de Imagen */}
      <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/80">
        <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 shadow-inner relative">
          {vistaPrevia ? (
            <img src={vistaPrevia} alt="Vista previa del servicio" className={`w-full h-full object-cover ${procesando ? 'opacity-40' : ''}`} />
          ) : (
            <Stethoscope size={24} className="text-slate-300" />
          )}
          {procesando && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 backdrop-blur-[1px]">
              <CargadorSpinner size="xs" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">Imagen del Servicio</label>
          <label className={`inline-flex items-center gap-1.5 bg-white hover:bg-slate-150 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${procesando ? 'opacity-55 cursor-not-allowed' : 'cursor-pointer'}`}>
            <Camera size={14} />
            {archivo ? "Cambiar foto" : "Cargar foto"}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" disabled={procesando} />
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
          <Combobox
            value={form.nombre}
            onChange={(val, precio) => {
              setForm((prev) => ({
                ...prev,
                nombre: val,
                precio: precio !== undefined ? precio.toString() : prev.precio,
              }));
            }}
            opciones={CATALOGO_PREDEFINIDO.flatMap((cat) =>
              cat.servicios.map((s) => ({
                label: s.nombre,
                precio: s.precio,
                categoria: cat.categoria,
              }))
            )}
            placeholder="Escribe o selecciona un servicio..."
            required={true}
          />
        </div>

        <div className="relative">
          <Tag className="absolute left-3 top-3 text-slate-400" size={18} />
          <input type="number" step="0.01" name="precio" value={form.precio} placeholder="Precio (S/.)" onChange={handleChange} required 
            className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white" />
        </div>
      </div>

      <AreaTexto 
        value={form.descripcion} 
        onChange={(val) => setForm(prev => ({ ...prev, descripcion: val }))} 
        placeholder="Descripción detallada del servicio..." 
        limite={250} 
        required={true}
      />

      <div className="flex gap-4 items-center">
        <div className="relative w-1/3">
          <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
          <input type="number" name="duracionMinutos" value={form.duracionMinutos} placeholder="Minutos" onChange={handleChange} required 
            className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white" />
        </div>
        
        <button 
          type="submit" 
          disabled={procesando}
          className="bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {procesando ? (
            <>
              <CargadorSpinner size="xs" color="border-white" />
              Guardando...
            </>
          ) : (
            <>
              <PlusCircle size={18} /> Guardar Servicio
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default FormularioServicio;