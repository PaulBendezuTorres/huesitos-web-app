import { useState } from "react";

// Catálogo predefinido con los datos de tu Landing Page
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

const ServicioForm = ({ onGuardar }) => {
  const estadoInicial = {
    nombre: "",
    descripcion: "",
    duracionMinutos: "",
    precio: "",
  };

  const [form, setForm] = useState(estadoInicial);

  // Manejador especial para el select de servicios
  const handleSelectChange = (e) => {
    const nombreSeleccionado = e.target.value;
    
    // Buscar el precio en el catálogo
    let precioEncontrado = "";
    for (const cat of CATALOGO_PREDEFINIDO) {
      const servicio = cat.servicios.find(s => s.nombre === nombreSeleccionado);
      if (servicio) {
        precioEncontrado = servicio.precio;
        break;
      }
    }

    setForm({
      ...form,
      nombre: nombreSeleccionado,
      precio: precioEncontrado, // Auto-completar el precio
    });
  };

  // Manejador normal para el resto de inputs
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar({
      ...form,
      duracionMinutos: parseInt(form.duracionMinutos),
      precio: parseFloat(form.precio),
    });
    setForm(estadoInicial);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
      <h2 className="text-lg font-semibold text-slate-800 border-b pb-2">Registrar Nuevo Servicio</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* SELECT DINÁMICO EN LUGAR DE INPUT DE TEXTO */}
        <select 
          name="nombre" 
          value={form.nombre} 
          onChange={handleSelectChange} 
          required 
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">-- Selecciona un servicio --</option>
          {CATALOGO_PREDEFINIDO.map((categoria, idxCategoria) => (
            <optgroup key={idxCategoria} label={categoria.categoria}>
              {categoria.servicios.map((servicio, idxServicio) => (
                <option key={idxServicio} value={servicio.nombre}>
                  {servicio.nombre}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        <input 
          type="number" 
          step="0.01" 
          name="precio" 
          value={form.precio} 
          placeholder="Precio (S/.)" 
          onChange={handleChange} 
          required 
          className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <textarea 
        name="descripcion" 
        value={form.descripcion} 
        placeholder="Descripción detallada del servicio..." 
        onChange={handleChange} 
        required 
        rows="3" 
        className="w-full border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
      />

      <div className="flex gap-4 items-center">
        <input 
          type="number" 
          name="duracionMinutos" 
          value={form.duracionMinutos} 
          placeholder="Duración (Minutos)" 
          onChange={handleChange} 
          required 
          className="w-1/3 border border-slate-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
        
        <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition w-full md:w-auto shadow-sm">
          Guardar Servicio
        </button>
      </div>
    </form>
  );
};

export default ServicioForm;