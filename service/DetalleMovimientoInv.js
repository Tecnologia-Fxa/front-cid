import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL + "/detalle-movimiento-inv"

const DetalleMovimientoInvService = {

    getKardex: (id_producto_bodega, fecha_inicio, fecha_fin) =>{
        return axios.get(`${API}/get-kardex?id_producto_bodega=${id_producto_bodega}&fecha_inicio=${fecha_inicio}&fecha_fin=${fecha_fin}`)
    }

}

export default DetalleMovimientoInvService