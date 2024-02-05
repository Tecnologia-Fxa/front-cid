import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL + "/producto"

const ProductoService = {

    getAllProducts: queryElements=>{
        let queryPath = ""
        queryElements.q_field?queryPath+=`q_field=${queryElements.q_field}`:queryPath+="q_field="
        queryElements.q?queryPath+=`&q=${queryElements.q}`:queryPath+="q="
        queryElements.page?queryPath+=`&page=${queryElements.page}`:queryPath+="&page="
        queryElements.limit?queryPath+=`&limit=${queryElements.limit}`:queryPath+="&limit="
        queryElements.order_by?queryPath+=`&order_by=${queryElements.order_by}`:queryPath+="&order_by="
        queryElements.order_direction?queryPath+=`&order_direction=${queryElements.order_direction}`:queryPath+="&order_direction="

        return axios.get(`${API}/get-all?${queryPath}`)
    },

    createNewProduct: data =>{
        return axios.post(`${API}/create-one`, data)
    },

    updateOneProduct: data =>{
        return axios.put(`${API}/update-one`, data)
    },

    createByFile: (data, updateProduct) =>{
        return axios.post(`${API}/create-by-file?update_ref=${updateProduct}`,data)
    }

}

export default ProductoService