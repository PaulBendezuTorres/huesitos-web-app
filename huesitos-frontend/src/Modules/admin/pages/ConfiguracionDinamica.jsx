import { useState, useEffect } from "react";
import axios from "axios";
import { Settings, Save, Building, Phone, Mail, MapPin, Clock, Percent } from 'lucide-react';

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
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8080/api/configuracion-negocio")
      .then((res) => {
        if (res.data) setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al obtener la configuración:", err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === "impuesto" ? parseFloat(value) || 0 : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8080/api/configuracion-negocio", form, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Configuración global actualizada con éxito.");
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("Error al intentar actualizar los parámetros.");
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8 font-semibold text-sky-600 animate-pulse">Cargando parámetros globales...</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden max-w-4xl mx-auto animate-in fade-in duration-500">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
        <Settings className="text-sky-500" size={24} />
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Configuración Global</h2>
          <p className="text-slate-500 text-sm">Parámetros operativos de la clínica.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Sección de Identidad */}
        <div className="space-y-5">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Información del Negocio</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Nombre Comercial</label>
              <div className="relative">
                <Building className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" name="nombreNegocio" value={form.nombreNegocio} onChange={handleChange} required
                  className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>
            </div>
            <div className="relative">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="email" name="correo" value={form.correo} onChange={handleChange} required
                  className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>
            </div>
            <div className="relative md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Dirección Física</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required
                  className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Operaciones */}
        <div className="space-y-5">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Operaciones y Contacto</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Teléfono Regular</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" name="telefono" value={form.telefono} onChange={handleChange} required
                  className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Celular Emergencias (24/7)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" name="telefonoEmergencia" value={form.telefonoEmergencia} onChange={handleChange} required
                  className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Horario Semana</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" name="horarioSemana" value={form.horarioSemana} onChange={handleChange} required
                  className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Horario Domingo</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="text" name="horarioDomingo" value={form.horarioDomingo} onChange={handleChange} required
                  className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Sección Financiera */}
        <div className="space-y-5">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Configuración Financiera</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Moneda</label>
              <select name="moneda" value={form.moneda} onChange={handleChange}
                className="w-full border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none bg-slate-50 focus:bg-white">
                <option value="Soles">Soles (S/.)</option>
                <option value="Dólares">Dólares ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Impuesto / IGV (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-3 text-slate-400" size={18} />
                <input type="number" step="0.01" name="impuesto" value={form.impuesto} onChange={handleChange} required
                  className="w-full pl-10 border border-slate-300 p-2.5 rounded-xl text-slate-800 focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-slate-50 focus:bg-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-slate-100">
          <button type="submit" disabled={guardando}
            className="bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 text-white px-8 py-3 rounded-xl font-black shadow-lg shadow-sky-500/30 transition-all flex items-center gap-2">
            <Save size={18} /> {guardando ? "Sincronizando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracionDinamica;