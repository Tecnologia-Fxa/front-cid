import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL + "/movimiento-inv"

const MovimientoInvService = {

    getAll: (queryElements) =>{
        let queryPath = ""
        queryElements.q_field?queryPath+=`q_field=${queryElements.q_field}`:queryPath+="q_field="
        queryElements.q?queryPath+=`&q=${queryElements.q}`:queryPath+="q="
        queryElements.page?queryPath+=`&page=${queryElements.page}`:queryPath+="&page="
        queryElements.limit?queryPath+=`&limit=${queryElements.limit}`:queryPath+="&limit="
        return axios.get(`${API}/get-all?${queryPath}`)
    },

    createMov: data =>{
        return axios.post(`${API}/create-mov`, data)
    },

    getOne: id_movimiento =>{
        return axios.get(`${API}/get-mov?id_movimiento=${id_movimiento}`)
    }

}

export default MovimientoInvService