import { useState } from "react";

const ServicioForm = ({ onGuardar }) =>{

    const [form, setForm] = useState({
            nombre: "",
            descripcion: "",
            duracionMinutos: "",
            precio: "",
    });
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
  };

  return (

    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow space-y-4"
    >

      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <textarea
        name="descripcion"
        placeholder="Descripción"
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="number"
        name="duracionMinutos"
        placeholder="Duración"
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <input
        type="number"
        step="0.01"
        name="precio"
        placeholder="Precio"
        onChange={handleChange}
        className="w-full border p-3 rounded"
      />

      <button
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Guardar
      </button>

    </form>
  );
};

export default ServicioForm;