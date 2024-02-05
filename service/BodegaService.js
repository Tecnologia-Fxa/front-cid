import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL + "/bodega"

const BodegaService = {

    create: (data) =>{
        return axios.post(`${API}/crear`, data)
    },

    getAll: ()=>{
        return axios.get(`${API}/get-all`)
    },

    updateName: data =>{
        return axios.put(`${API}/update-name`, data)
    }

}

export default BodegaService