import { useState, useEffect } from "react";
import axios from "axios";

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
    return <div className="text-center p-8 font-medium text-slate-500 animate-pulse">Cargando parámetros globales...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden max-w-4xl mx-auto">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-800">Configuración Dinámica de Negocio</h2>
        <p className="text-slate-500 text-sm mt-1">Modifica la información general de la clínica.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Comercial</label>
            <input type="text" name="nombreNegocio" value={form.nombreNegocio} onChange={handleChange} required
              className="w-full border border-slate-300 p-2.5 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
            <input type="email" name="correo" value={form.correo} onChange={handleChange} required
              className="w-full border border-slate-300 p-2.5 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono Regular</label>
            <input type="text" name="telefono" value={form.telefono} onChange={handleChange} required
              className="w-full border border-slate-300 p-2.5 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Celular Emergencias (24/7)</label>
            <input type="text" name="telefonoEmergencia" value={form.telefonoEmergencia} onChange={handleChange} required
              className="w-full border border-slate-300 p-2.5 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Dirección Física</label>
            <input type="text" name="direccion" value={form.direccion} onChange={handleChange} required
              className="w-full border border-slate-300 p-2.5 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Horario Semana</label>
            <input type="text" name="horarioSemana" value={form.horarioSemana} onChange={handleChange} placeholder="Ej: Lunes a Sábado: 08:00 AM - 08:00 PM" required
              className="w-full border border-slate-300 p-2.5 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Horario Domingo</label>
            <input type="text" name="horarioDomingo" value={form.horarioDomingo} onChange={handleChange} placeholder="Ej: Domingos: 09:00 AM - 02:00 PM" required
              className="w-full border border-slate-300 p-2.5 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Moneda</label>
            <select name="moneda" value={form.moneda} onChange={handleChange}
              className="w-full border border-slate-300 p-2.5 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500">
              <option value="Soles">Soles</option>
              <option value="Dólares">Dólares</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Impuesto / IGV (%)</label>
            <input type="number" step="0.01" name="impuesto" value={form.impuesto} onChange={handleChange} required
              className="w-full border border-slate-300 p-2.5 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button type="submit" disabled={guardando}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition disabled:bg-slate-400">
            {guardando ? "Sincronizando..." : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConfiguracionDinamica;