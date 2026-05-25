import { useState } from "react";

const ConfiguracionPage = () => {

  const [config, setConfig] = useState({
    nombreNegocio: "Veterinaria Huesitos",
    telefono: "999888777",
    correo: "admin@huesitos.com",
    direccion: "Av. Principal 123",
    horario: "08:00 AM - 08:00 PM",
    moneda: "PEN",
    impuesto: 18,
    reservasActivas: true,
  });

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setConfig({
      ...config,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {

    e.preventDefault();

    console.log("Configuración guardada:", config);

    alert("Configuración actualizada");
  };

  return (

    <div className="space-y-8">

      {/* HEADER */}
      <div>

        <h2 className="text-3xl font-bold text-slate-800">
          Configuración Dinámica
        </h2>

        <p className="text-slate-500 mt-1">
          Administra parámetros globales del sistema
        </p>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-6"
      >

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NOMBRE */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nombre del negocio
            </label>

            <input
              type="text"
              name="nombreNegocio"
              value={config.nombreNegocio}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* TELÉFONO */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Teléfono
            </label>

            <input
              type="text"
              name="telefono"
              value={config.telefono}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* CORREO */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Correo
            </label>

            <input
              type="email"
              name="correo"
              value={config.correo}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* DIRECCIÓN */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Dirección
            </label>

            <input
              type="text"
              name="direccion"
              value={config.direccion}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* HORARIO */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Horario
            </label>

            <input
              type="text"
              name="horario"
              value={config.horario}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          {/* MONEDA */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Moneda
            </label>

            <select
              name="moneda"
              value={config.moneda}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >

              <option value="PEN">Soles (PEN)</option>
              <option value="USD">Dólares (USD)</option>

            </select>

          </div>

          {/* IMPUESTO */}
          <div>

            <label className="block text-sm font-medium text-slate-700 mb-2">
              Impuesto (%)
            </label>

            <input
              type="number"
              name="impuesto"
              value={config.impuesto}
              onChange={handleChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>

        {/* SWITCH */}
        <div className="flex items-center gap-4">

          <input
            type="checkbox"
            name="reservasActivas"
            checked={config.reservasActivas}
            onChange={handleChange}
            className="w-5 h-5"
          />

          <label className="text-slate-700 font-medium">
            Permitir reservas online
          </label>

        </div>

        {/* BOTÓN */}
        <div className="pt-4">

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Guardar Configuración
          </button>

        </div>

      </form>

    </div>
  );
};

export default ConfiguracionPage;