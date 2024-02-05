import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL + "/tipo-movimiento"

const TipoMovimientoService = {

    getAll:()=>{
        return axios.get(`${API}/get-all`)
    },

    create:(data)=>{
        return axios.post(`${API}/create`,data)
    },

    update:(data)=>{
        return axios.put(`${API}/update`,data)
    },

    changeState:(data)=>{
        return axios.put(`${API}/change-state`,data)
    }

}

export default TipoMovimientoService