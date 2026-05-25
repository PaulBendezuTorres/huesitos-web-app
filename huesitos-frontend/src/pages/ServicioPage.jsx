import ServicioForm from "../components/ServicioForm";
import ServicioTable from "../components/ServicioTable";

import {
    crearServicio,
    cambiarEstadoServicio,
} from "../services/servicioService";

import { useServicios } from "../hooks/useServicios";

const ServiciosPage = ()=> {
    const {
        servicios,
        obtenerServicios,
    } = useServicios();

    const guardar = async (data) => {

    await crearServicio(data);
    obtenerServicios();

    };

    const cambiarEstado = async (Id, activo) => {
        await cambiarEstadoServicio(Id, activo);
        obtenerServicios();
    };

    return(
         <div className="p-8 space-y-8">

      <h1 className="text-3xl font-bold">
        Gestión de Servicios
      </h1>

      <ServicioForm onGuardar={guardar} />

      <ServicioTable
        servicios={servicios}
        onEstado={cambiarEstado}
      />

    </div>
    )
}

export default ServiciosPage;
